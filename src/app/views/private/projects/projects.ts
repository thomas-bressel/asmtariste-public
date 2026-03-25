import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeoService } from '@services/seo.service';
import { ProjectTemplatesService } from '@services/project-templates.service';
import { ProjectTemplate, UserProject } from '@models/project.model';

const DIFFICULTY_ORDER: Record<string, number> = {
  'beginner': 0, 'beginner-plus': 1, 'intermediate': 2,
  'intermediate-plus': 3, 'advanced': 4, 'expert': 5,
};

@Component({
  selector: 'main[app-projects]',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {

  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  readonly templatesService = inject(ProjectTemplatesService);

  readonly templates = this.templatesService.templates;
  readonly userProjects = signal<UserProject[]>(this._loadUserProjects());

  readonly sortedTemplates = computed(() =>
    [...this.templates()].sort((a, b) =>
      (DIFFICULTY_ORDER[a.difficulty] ?? 99) - (DIFFICULTY_ORDER[b.difficulty] ?? 99)
    )
  );

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Projets — Créer un jeu sur Atari ST',
      description: 'Guidez-vous pas à pas dans la création d\'un jeu complet sur Atari ST en assembleur 68000.',
      keywords: 'projet, jeu, Atari ST, assembleur, 68000',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });
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

  projectProgress(userProject: UserProject): number {
    const all = userProject.phases.flatMap(p => p.tasks);
    const done = all.filter(t => t.checked).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  }

  currentPhaseName(userProject: UserProject): string {
    const template = this.templatesService.getBySlug(userProject.templateSlug);
    if (!template) return '';
    const activePhase = userProject.phases.find(p => p.unlocked && !p.completedAt);
    if (!activePhase) return 'Terminé';
    return template.phases.find(p => p.id === activePhase.phaseId)?.title ?? '';
  }

  templateForUserProject(userProject: UserProject): ProjectTemplate | undefined {
    return this.templatesService.getBySlug(userProject.templateSlug);
  }

  goToTemplate(slug: string): void {
    this.router.navigate(['/projects', slug]);
  }

  resumeProject(userProject: UserProject): void {
    this.router.navigate(['/projects', userProject.templateSlug, userProject.id]);
  }

  private _loadUserProjects(): UserProject[] {
    try {
      const raw = localStorage.getItem('user_projects');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
