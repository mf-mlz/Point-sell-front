import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OpenPayPayment } from '../models/interfaces';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OpenpayService {
  private idOpenPay = environment.idOpenPay;
  private pkeyOpenPay = environment.pkeyOpenPay;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadOpenPayScripts();
  }


  /* Load Openpay Scripts */
  private loadOpenPayScripts(): void {
    this.loadScript(
      'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'
    )
      .then(() => this.loadScript('https://js.openpay.mx/openpay.v1.min.js'))
      .then(() =>
        this.loadScript('https://js.openpay.mx/openpay-data.v1.min.js')
      )
      .then(() => this.initializeOpenPay())
      .catch((error) => console.error('Error loading scripts:', error));
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private initializeOpenPay(): void {
    if (typeof OpenPay !== 'undefined') {
      OpenPay.setId(this.idOpenPay);
      OpenPay.setApiKey(this.pkeyOpenPay);
      OpenPay.setSandboxMode(true);
      console.log('OpenPay initialized successfully');
    } else {
      console.error('OpenPay is not defined');
    }
  }

  /* Promise Openpay loading */
  isOpenPayReady(): Promise<boolean> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (typeof OpenPay !== 'undefined') {
          console.log(OpenPay);

          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  }

  /* Create Token Openpay */
  createToken(cardData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof OpenPay !== 'undefined') {
        OpenPay.token.create(
          cardData,
          (response: any) => {
            const token_id = response.data.id;
            resolve(token_id);
          },
          (errorResponse: any) => {
            reject(errorResponse);
          }
        );
      } else {
        reject(new Error('OpenPay is not defined'));
      }
    });
  }

  /* Post */
  processPayment(data: OpenPayPayment): Observable<any> {
    const url = `${this.apiUrl}/sales/payment`;
    return this.http.post(url, data, { withCredentials: true });
  }
}
