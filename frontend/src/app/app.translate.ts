import { importProvidersFrom } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export const provideTranslate = () => importProvidersFrom(
  TranslateModule.forRoot({
    defaultLanguage: (localStorage.getItem('lang')||'pt'),
    loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
  })
);
