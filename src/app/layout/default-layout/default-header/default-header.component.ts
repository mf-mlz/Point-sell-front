import { NgStyle, NgTemplateOutlet, CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiServiceEmployees } from 'src/app/services/api.service.employees';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { IconsModule } from '../../../icons/icons.module';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [
    IconsModule,
    ContainerComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    BreadcrumbRouterComponent,
    ThemeDirective,
    DropdownComponent,
    DropdownToggleDirective,
    TextColorDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    BadgeComponent,
    DropdownDividerDirective,
    ProgressBarDirective,
    ProgressComponent,
    NgStyle,
    CommonModule
  ],
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  public userPayload: any;
  public apiUpload = environment.apiUpload;
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' },
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return (
      this.colorModes.find((mode) => mode.name === currentMode)?.icon ??
      'cilSun'
    );
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiServiceEmployees: ApiServiceEmployees,
    private userService: UserService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.userPayload = await this.userService.getUser(); 
  }

  onLogout() {
    /* Clear SessionStorage */
    this.authService.clearPayloadFromSession();
    this.router.navigate(['/login']);
  }

  sidebarId = input('sidebar1');

  public newMessages = [
    {
      id: 0,
      from: 'Jessica Williams',
      avatar: '7.jpg',
      status: 'success',
      title: 'Urgent: System Maintenance Tonight',
      time: 'Just now',
      link: 'apps/email/inbox/message',
      message:
        "Attention team, we'll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly...",
    },
    {
      id: 1,
      from: 'Richard Johnson',
      avatar: '6.jpg',
      status: 'warning',
      title: 'Project Update: Milestone Achieved',
      time: '5 minutes ago',
      link: 'apps/email/inbox/message',
      message:
        "Kudos on hitting sales targets last quarter! Let's keep the momentum. New goals, new victories ahead...",
    },
    {
      id: 2,
      from: 'Angela Rodriguez',
      avatar: '5.jpg',
      status: 'danger',
      title: 'Social Media Campaign Launch',
      time: '1:52 PM',
      link: 'apps/email/inbox/message',
      message:
        'Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement...',
    },
    {
      id: 3,
      from: 'Jane Lewis',
      avatar: '4.jpg',
      status: 'info',
      title: 'Inventory Checkpoint',
      time: '4:03 AM',
      link: 'apps/email/inbox/message',
      message:
        "Team, it's time for our monthly inventory check. Accurate counts ensure smooth operations. Let's nail it...",
    },
    {
      id: 3,
      from: 'Ryan Miller',
      avatar: '4.jpg',
      status: 'info',
      title: 'Customer Feedback Results',
      time: '3 days ago',
      link: 'apps/email/inbox/message',
      message:
        "Our latest customer feedback is in. Let's analyze and discuss improvements for an even better service...",
    },
  ];

  public newNotifications = [
    {
      id: 0,
      title: 'New user registered',
      icon: 'cilUserFollow',
      color: 'success',
    },
    { id: 1, title: 'User deleted', icon: 'cilUserUnfollow', color: 'danger' },
    {
      id: 2,
      title: 'Sales report is ready',
      icon: 'cilChartPie',
      color: 'info',
    },
    { id: 3, title: 'New client', icon: 'cilBasket', color: 'primary' },
    {
      id: 4,
      title: 'Server overloaded',
      icon: 'cilSpeedometer',
      color: 'warning',
    },
  ];

  public newStatus = [
    {
      id: 0,
      title: 'CPU Usage',
      value: 25,
      color: 'info',
      details: '348 Processes. 1/4 Cores.',
    },
    {
      id: 1,
      title: 'Memory Usage',
      value: 70,
      color: 'warning',
      details: '11444GB/16384MB',
    },
    {
      id: 2,
      title: 'SSD 1 Usage',
      value: 90,
      color: 'danger',
      details: '243GB/256GB',
    },
  ];

  public newTasks = [
    { id: 0, title: 'Upgrade NPM', value: 0, color: 'info' },
    { id: 1, title: 'ReactJS Version', value: 25, color: 'danger' },
    { id: 2, title: 'VueJS Version', value: 50, color: 'warning' },
    { id: 3, title: 'Add new layouts', value: 75, color: 'info' },
    { id: 4, title: 'Angular Version', value: 100, color: 'success' },
  ];
}
