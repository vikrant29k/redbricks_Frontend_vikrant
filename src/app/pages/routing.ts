import { Routes } from "@angular/router";

const Routing: Routes = [
    {
        path: '',
        loadChildren: () => {
            return import('./dashboard/dashboard.module').then((m) => m.DashboardModule);
        }
    }
]


export { Routing };