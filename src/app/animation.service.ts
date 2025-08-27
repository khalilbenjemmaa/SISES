// src/app/animation.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  public cardRect: DOMRect | null = null;
  public imageUrl: string | null = null;
}
