import { Routes } from "@angular/router";
import { ShowLayoutComponent } from "./location/component/show-layout/show-layout.component";

const AdminRouting: Routes = [
    {
        path: '',
        loadChildren: () => {
            return import('./dashboard/dashboard.module').then((m) => m.DashboardModule);
        }
    },
    {
      path: 'view-layouts',
      loadChildren: () => {
          return import('./view-layouts/view-layouts.module').then((m) => m.ViewLayoutsModule);
      }
  },
    {
        path: 'location',
        loadChildren: () => {
            return import('./location/location.module').then((m) => m.LocationModule);
        }
    },
    {
        path: 'old-proposal',
        loadChildren: () => {
            return import('./old-proposal/old-proposal.module').then((m) => m.OldProposalModule);
        }
    },
    {
        path: 'new-proposal',
        loadChildren: () => {
            return import('./new-proposal/new-proposal.module').then((m) => m.NewProposalModule);
        }
    },
    {
        path: 'log',
        loadChildren: () => {
            return import('./log/log.module').then((m) => m.LogModule);
        }
    },
    {
        path: 'profile',
        loadChildren: () => {
            return import('./profile/profile.module').then((m) => m.ProfileModule);
        }
    },
    {
        path: 'users',
        loadChildren: () => {
            return import('./users/users.module').then((m) => m.UsersModule);
        }
    },
    {
        path: 'broker',
        loadChildren: () => {
            return import('./broker/broker.module').then((m) => m.BrokerModule);
        }
    },
    {
        path: 'cost',
        loadChildren: () => {
            return import('./cost/cost.module').then((m) => m.CostModule);
        }
    }

];

export { AdminRouting };
