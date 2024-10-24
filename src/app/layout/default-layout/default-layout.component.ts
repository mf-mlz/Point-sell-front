import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconDirective } from '@coreui/icons-angular';
import { ModulesPermissions } from 'src/app/models/interfaces';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';
import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { NavService } from './_nav';
import { INavData } from '@coreui/angular';
import { ApiServicePermissions } from 'src/app/services/api.service.permissions';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
  ],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: INavData[] = [];
  public navItemsPermissions: INavData[] = [];
  public accessModule: ModulesPermissions[] = [];

  constructor(
    private navService: NavService,
    private apiServicePermissions: ApiServicePermissions
  ) {}

  ngOnInit(): void {
    this.navItems = [];
    this.navService.generateModule().subscribe({
      next: (items) => {
        this.navItems = items;
      },
      error: (error) => {
        console.log('Error al obtener los elementos de navegación:', error);
      },
    });
  }

  onScrollbarUpdate($event: any) {}
}
