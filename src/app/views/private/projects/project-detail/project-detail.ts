import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectTemplatesService } from '@services/project-templates.service';
import { ProjectTemplate, MachineConfig } from '@models/project.model';

const MACHINE_LABELS: Record<MachineConfig, string> = {
  'emulator': 'Émulateur (Hatari)',
  'st-512k': 'Atari ST 512 Ko',
  'st-1mo': 'Atari ST 1 Mo',
  'ste': 'Atari STe',
};

@Component({
  selector: 'main[app-project-detail]',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly templatesService = inject(ProjectTemplatesService);

  template = signal<ProjectTemplate | null>(null);
  selectedMachine = signal<MachineConfig>('emulator');
  showStartModal = signal(false);

  readonly machineOptions: { value: MachineConfig; label: string }[] = [
    { value: 'emulator', label: MACHINE_LABELS['emulator'] },
    { value: 'st-512k', label: MACHINE_LABELS['st-512k'] },
    { value: 'st-1mo', label: MACHINE_LABELS['st-1mo'] },
    { value: 'ste', label: MACHINE_LABELS['ste'] },
  ];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const tmpl = this.templatesService.getBySlug(slug);
    if (!tmpl) { this.router.navigate(['/projects']); return; }
    this.template.set(tmpl);
  }

  difficultyClass(difficulty: string): string {
    const map: Record<string, string> = {
      'beginner': 'level--beginner',
      'beginner-plus': 'level--beginner-plus',
      'intermediate': 'level--intermediate',
      'intermediate-plus': 'level--intermediate-plus',
      'advanced': 'level--advanced',
      'expert': 'level--expert',
    };
    return map[difficulty] ?? '';
  }

  openStartModal(): void {
    this.showStartModal.set(true);
  }

  closeStartModal(): void {
    this.showStartModal.set(false);
  }

  confirmStart(): void {
    const tmpl = this.template();
    if (!tmpl) return;
    const userProject = this.templatesService.buildEmptyUserProject(tmpl, this.selectedMachine());
    const existing: any[] = JSON.parse(localStorage.getItem('user_projects') ?? '[]');
    existing.push(userProject);
    localStorage.setItem('user_projects', JSON.stringify(existing));
    this.router.navigate(['/projects', tmpl.slug, userProject.id]);
  }

  totalTasks(tmpl: ProjectTemplate): number {
    return tmpl.phases.reduce((sum, p) => sum + p.tasks.length, 0);
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
