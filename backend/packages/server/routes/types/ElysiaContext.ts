import { DependenceInjectionContainer } from 'packages/Core/src';
import { BaseRequestBody } from './BaseRequestBody';
import { RouteParams } from './RouteParams';

export interface ElysiaContext {
  body: BaseRequestBody;
  di: DependenceInjectionContainer;
  set: {
    status: number;
  };
  params?: RouteParams;
}
