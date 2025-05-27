import { Component } from '@angular/core';
import { GoogleSigninService } from './google-signin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private googleSigninService: GoogleSigninService) { }

  signInWithGoogle(): void {
    this.googleSigninService.signInWithGoogle()
      .then(user => {
        // Handle successful sign-in
        console.log(user);
      })
      .catch(error => {
        // Handle sign-in error
        console.error(error);
      });
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