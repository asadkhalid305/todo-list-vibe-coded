/**
 * Animation and UI Interaction Types
 */

export interface AnimationConfig {
  duration: string;
  easing: string;
  delay?: string;
}

export interface StaggerConfig extends AnimationConfig {
  baseDelay: number;
  maxDelay: number;
}

export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: string;
}

export type AnimationType = 
  | 'listEnter' 
  | 'listLeave' 
  | 'staggerEnter'
  | 'cardHover'
  | 'formSubmit'
  | 'themeTransition'
  | 'progressFill'
  | 'messageAppear';

export type AnimationClassType = 
  | 'list-item'
  | 'card'
  | 'button'
  | 'form'
  | 'progress'
  | 'theme';

export interface TransitionConfig {
  name: string;
  css: boolean;
  onEnter: (el: Element, done: () => void) => void;
  onLeave: (el: Element, done: () => void) => void;
}

export interface KeyframeAnimation {
  [key: string]: string | number;
}

export type AnimationPreset = 
  | 'fadeIn'
  | 'fadeOut'
  | 'slideInUp'
  | 'slideOutDown'
  | 'scaleIn'
  | 'scaleOut'
  | 'bounce'
  | 'shake';
