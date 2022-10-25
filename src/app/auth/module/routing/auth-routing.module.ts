import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "../../auth.component";
import { AuthForgotPasswordComponent } from "../../component/forgot-passwod/forgot-password.component";
import { AuthLoginComponent } from "../../component/login/login.component";

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: AuthLoginComponent
            },
            {
                path: 'forgot-password',
                component: AuthForgotPasswordComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}