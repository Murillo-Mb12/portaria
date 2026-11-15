import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, Injectable, LOCALE_ID, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { autenticacaoInterceptor } from './core/interceptors/autenticacao.interceptor';

// Datas e números no formato brasileiro
registerLocaleData(localePt);

/** Título da aba do navegador: "Moradores · Portaria LSVP" (o nome da tela vem do "title" da rota). */
@Injectable()
class TituloDaAba extends TitleStrategy {
  private title = inject(Title);

  override updateTitle(estado: RouterStateSnapshot): void {
    const tela = this.buildTitle(estado);
    this.title.setTitle(tela ? `${tela} · Portaria LSVP` : 'Portaria LSVP');
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([autenticacaoInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: TitleStrategy, useClass: TituloDaAba },
  ],
};
