import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Pipe } from '@angular/core';
import { NgIf, AsyncPipe} from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  imports: [NgIf, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('googleButton', { static: true }) googleButtonDiv!: ElementRef; // For renderButton

  private userSubscription!: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.initGoogleSignIn();

    // If you want to render the button explicitly in a specific div:
    // this.authService.renderGoogleButton(this.googleButtonDiv.nativeElement);

    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        console.log('User logged in from component:', user);
      } else {
        console.log('User logged out from component');
      }
    });
  }

    // Optional: if you want to trigger sign-in with a custom button
  signInWithGoogle(): void {
  //   // This would typically be handled by the Google library's button
  //   // or One Tap. For a truly custom programmatic trigger with GIS,
  //   // you might need to explore advanced options or ensure the GIS client
  //   // is initialized and then prompt for login.
  //   // The `google.accounts.id.prompt()` in initGoogleSignIn usually handles this.
  //   console.log('Custom sign in button clicked - GIS prompt should appear if configured');
  }


  signOut(): void {
    this.authService.signOut();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  signInWithApple(): void {
    console.log('Initiate Apple sign-in');
    // Call your Apple sign-in service method here
  }

  handleCredentialResponse(response: any): void {
    console.log("Encoded JWT ID token: " + response.credential);
    // Send this ID token to your backend for verification and session creation
    this.sendTokenToBackend(response.credential);
  }

  sendTokenToBackend(token: string): void {
    // Implement your HTTP service call to send the token to your backend
    // Example using Angular's HttpClient:
    // this.http.post('YOUR_BACKEND_GOOGLE_VERIFY_ENDPOINT', { token }).subscribe(
    //   (response) => {
    //     console.log('Backend Response:', response);
    //     // Handle successful login (e.g., store user info, redirect)
    //   },
    //   (error) => {
    //     console.error('Error sending token to backend:', error);
    //   }
    // );
  }
}