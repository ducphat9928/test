import {
    FacebookLoginProvider,
    GoogleLoginProvider,
    SocialAuthService,
    SocialUser,
} from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import {
    SignInMutation,
    SignInMutationVariables,
} from "../../../common/generated-types";
import { DataService } from "../../../core/providers/data/data.service";
import { StateService } from "../../../core/providers/state/state.service";
import { SIGN_IN } from "./sign-in.graphql";

@Component({
    selector: "vsf-sign-in",
    templateUrl: "./sign-in.component.html",
    styleUrls: ["./sign-in.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
    user: SocialUser;
    loggedIn: boolean;
    @Input() navigateToOnSuccess: any[] | undefined;
    @Input() displayRegisterLink = true;
    private accessToken = "";
    emailAddress: string;
    password: string;
    rememberMe = false;
    invalidCredentials = false;

    constructor(
        private dataService: DataService,
        private stateService: StateService,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private authService: SocialAuthService,
        private httpClient: HttpClient
    ) {}
    getGoogleCalendarData(): void {
        if (!this.accessToken) return;

        this.httpClient
            .get(
                "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                {
                    headers: { Authorization: `Bearer ${this.accessToken}` },
                }
            )
            .subscribe((events) => {
                alert("Look at your console");
                console.log("events", events);
            });
    }
    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = user != null;
        });
    }

    signInWithGoogle(): void {
        this.authService
            .signIn(GoogleLoginProvider.PROVIDER_ID)
            .then((x) => console.log(x));
    }

    signInWithFB(): void {
        this.authService
            .signIn(FacebookLoginProvider.PROVIDER_ID)
            .then((x) => console.log(x));
    }

    signOut(): void {
        this.authService.signOut();
    }

    // refreshToken(): void {
    //     this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    // }

    // getAccessToken(): void {
    //     this.authService
    //         .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
    //         .then((accessToken) => (this.accessToken = accessToken));
    // }

    // signIn() {
    //     this.dataService
    //         .mutate<SignInMutation, SignInMutationVariables>(SIGN_IN, {
    //             emailAddress: this.emailAddress,
    //             password: this.password,
    //             rememberMe: this.rememberMe,
    //         })
    //         .subscribe({
    //             next: ({ login }) => {
    //                 switch (login.__typename) {
    //                     case "CurrentUser":
    //                         this.stateService.setState("signedIn", true);
    //                         const commands = this.navigateToOnSuccess || ["/"];
    //                         this.router.navigate(commands);
    //                         break;
    //                     case "NativeAuthStrategyError":
    //                     case "InvalidCredentialsError":
    //                         this.displayCredentialsError();
    //                         break;
    //                 }
    //             },
    //         });
    // }

    private displayCredentialsError() {
        this.invalidCredentials = false;
        this.changeDetector.markForCheck();
        setTimeout(() => {
            this.invalidCredentials = true;
            this.changeDetector.markForCheck();
        }, 50);
    }
}
