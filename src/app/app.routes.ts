import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { DocumentsComponent } from './components/document/documents.component';
import { VectorStoresComponent } from './components/document/vector-stores.component';
import { AssistantsComponent } from './components/assistant/assistants.component';
import { SettingsComponent } from './components/settings/settings.component';
import { authGuard } from './guards/auth.guard';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: DashboardHomeComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'vector-stores', component: VectorStoresComponent },
      { path: 'assistants', component: AssistantsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
