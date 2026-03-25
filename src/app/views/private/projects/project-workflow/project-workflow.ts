import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectTemplatesService } from '@services/project-templates.service';
import {
  ProjectTemplate, UserProject, UserPhaseState, FeltDifficulty
} from '@models/project.model';

@Component({
  selector: 'main[app-project-workflow]',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-workflow.html',
  styleUrl: './project-workflow.scss',
})
export class ProjectWorkflow implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly templatesService = inject(ProjectTemplatesService);

  template = signal<ProjectTemplate | null>(null);
  userProject = signal<UserProject | null>(null);
  expandedPhase = signal<string | null>(null);

  // État local du formulaire de livrable
  deliverableInput: Record<string, string> = {};
  selectedFileName: Record<string, string> = {};
  selectedFile: Record<string, File> = {};
  noteInput: Record<string, string> = {};
  showNoteEditor: Record<string, boolean> = {};
  showDeliverableForm: Record<string, boolean> = {};
  showFeltDifficulty: Record<string, boolean> = {};

  readonly ACCEPTED_EXTENSIONS = ['.st', '.msa', '.zip'];

  readonly globalProgress = computed(() => {
    const up = this.userProject();
    if (!up) return 0;
    const all = up.phases.flatMap(p => p.tasks);
    const done = all.filter(t => t.checked).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const projectId = this.route.snapshot.paramMap.get('id') ?? '';
    const tmpl = this.templatesService.getBySlug(slug);
    if (!tmpl) { this.router.navigate(['/projects']); return; }
    this.template.set(tmpl);

    const projects: UserProject[] = JSON.parse(localStorage.getItem('user_projects') ?? '[]');
    const up = projects.find(p => p.id === projectId);
    if (!up) { this.router.navigate(['/projects', slug]); return; }
    this.userProject.set(up);

    // Ouvrir la première phase active
    const active = up.phases.find(p => p.unlocked && !p.completedAt);
    if (active) this.expandedPhase.set(active.phaseId);

    // Pré-remplir les inputs depuis l'état sauvegardé
    up.phases.forEach(p => {
      this.deliverableInput[p.phaseId] = p.deliverableUrl ?? '';
      this.noteInput[p.phaseId] = p.note ?? '';
    });
  }

  isPhaseExpanded(phaseId: string): boolean {
    return this.expandedPhase() === phaseId;
  }

  togglePhase(phaseId: string): void {
    this.expandedPhase.set(this.expandedPhase() === phaseId ? null : phaseId);
  }

  getPhaseState(phaseId: string): UserPhaseState | undefined {
    return this.userProject()?.phases.find(p => p.phaseId === phaseId);
  }

  phaseProgress(phaseId: string): number {
    const state = this.getPhaseState(phaseId);
    if (!state) return 0;
    const done = state.tasks.filter(t => t.checked).length;
    return state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0;
  }

  isTaskChecked(phaseId: string, taskId: string): boolean {
    return this.getPhaseState(phaseId)?.tasks.find(t => t.taskId === taskId)?.checked ?? false;
  }

  toggleTask(phaseId: string, taskId: string): void {
    const up = this.userProject();
    if (!up) return;
    const phase = up.phases.find(p => p.phaseId === phaseId);
    if (!phase || !phase.unlocked) return;
    const task = phase.tasks.find(t => t.taskId === taskId);
    if (task) task.checked = !task.checked;
    this._save(up);
  }

  onFileSelected(phaseId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.ACCEPTED_EXTENSIONS.includes(ext)) return;
    this.selectedFile[phaseId] = file;
    this.selectedFileName[phaseId] = file.name;
    // Stockage temporaire du nom de fichier comme référence locale
    this.deliverableInput[phaseId] = file.name;
  }

  canSubmitDeliverable(phaseId: string): boolean {
    return !!this.selectedFileName[phaseId];
  }

  submitDeliverable(phaseId: string): void {
    const up = this.userProject();
    if (!up) return;
    const phase = up.phases.find(p => p.phaseId === phaseId);
    if (!phase) return;

    // Pour l'instant on stocke le nom du fichier — l'upload réel se fera côté serveur
    phase.deliverableUrl = this.selectedFileName[phaseId];
    phase.completedAt = new Date().toISOString();
    this.showDeliverableForm[phaseId] = false;
    this.showFeltDifficulty[phaseId] = true;

    // Déverrouiller la phase suivante
    const tmpl = this.template();
    if (tmpl) {
      const phaseIndex = tmpl.phases.findIndex(p => p.id === phaseId);
      if (phaseIndex >= 0 && phaseIndex + 1 < tmpl.phases.length) {
        const nextPhaseId = tmpl.phases[phaseIndex + 1].id;
        const nextState = up.phases.find(p => p.phaseId === nextPhaseId);
        if (nextState) {
          nextState.unlocked = true;
          nextState.startedAt = new Date().toISOString();
        }
        this.expandedPhase.set(nextPhaseId);
      }
    }
    this._save(up);
  }

  setFeltDifficulty(phaseId: string, value: FeltDifficulty): void {
    const up = this.userProject();
    if (!up) return;
    const phase = up.phases.find(p => p.phaseId === phaseId);
    if (phase) phase.feltDifficulty = value;
    this.showFeltDifficulty[phaseId] = false;
    this._save(up);
  }

  saveNote(phaseId: string): void {
    const up = this.userProject();
    if (!up) return;
    const phase = up.phases.find(p => p.phaseId === phaseId);
    if (!phase) return;
    const now = new Date().toISOString();
    phase.note = this.noteInput[phaseId];
    if (!phase.noteCreatedAt) phase.noteCreatedAt = now;
    phase.noteUpdatedAt = now;
    this.showNoteEditor[phaseId] = false;
    this._save(up);
  }

  phaseStatusLabel(state: UserPhaseState): string {
    if (state.completedAt) return 'Livrable soumis';
    if (!state.unlocked) return 'Verrouillée';
    const done = state.tasks.filter(t => t.checked).length;
    if (done === 0) return 'Non démarrée';
    return `${done}/${state.tasks.length} tâches`;
  }

  phaseStatusClass(state: UserPhaseState): string {
    if (state.completedAt) return 'status--done';
    if (!state.unlocked) return 'status--locked';
    const done = state.tasks.filter(t => t.checked).length;
    return done > 0 ? 'status--active' : 'status--idle';
  }

  goBack(): void {
    const tmpl = this.template();
    this.router.navigate(['/projects', tmpl?.slug ?? '']);
  }

  private _save(up: UserProject): void {
    this.userProject.set({ ...up });
    const all: UserProject[] = JSON.parse(localStorage.getItem('user_projects') ?? '[]');
    const idx = all.findIndex(p => p.id === up.id);
    if (idx >= 0) all[idx] = up;
    localStorage.setItem('user_projects', JSON.stringify(all));
  }
}
