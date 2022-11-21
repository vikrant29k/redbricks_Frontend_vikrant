import { Routes } from "@angular/router";

const Routing: Routes = [
    {
        path: '',
        loadChildren: () => {
            return import('./dashboard/dashboard.module').then((m) => m.DashboardModule);
        }
    },
    {
        path: 'new-proposal',
        loadChildren: () => {
            return import('./new-proposal/new-proposal.module').then((m) => m.NewProposalModule);
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
    }
]


export { Routing };
