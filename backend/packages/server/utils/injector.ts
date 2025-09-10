import { AuthService } from '../services/Auth';
import { DependenceInjectionContainer } from '@schematransfer/core';
import { IStore } from 'packages/Core/src/ports/IStore';
import { ProdoctivityClodStore } from '@schematransfer/prodoctivitycloud';
import { ProdoctivityFluencyStore } from '@schematransfer/prodoctivity5';
import { SchemaService } from '../services/Schema';
import { SERVICE_KEYS } from '../routes/utils/SERVICE_KEYS';

export let container: DependenceInjectionContainer | undefined = undefined;

export const buildContainer = async () => {
  container = new DependenceInjectionContainer();

  container.register<IStore>('ClodStore', ProdoctivityClodStore);
  container.register<IStore>('FluencyStore', ProdoctivityFluencyStore);

  // injectar los authservices por store
  container.register<AuthService>(
    'AuthServiceCloud',
    () => {
      const cloudStore = container!.resolve<IStore>('ClodStore');
      return new AuthService(cloudStore);
    },
    'singleton',
  );
  container.register<AuthService>(
    'AuthServiceFluency',
    () => {
      const cloudStore = container!.resolve<IStore>('FluencyStore');
      return new AuthService(cloudStore);
    },
    'singleton',
  );

  // injectar las dependencias  de los Schemas service por store
  container.register<SchemaService>(
    SERVICE_KEYS.Cloud,
    () => {
      const cloudStore = container!.resolve<IStore>('ClodStore');
      return new SchemaService(cloudStore);
    },
    'singleton',
  );
  container.register<SchemaService>(
    SERVICE_KEYS.Fluency,
    () => {
      const fluencyStore = container!.resolve<IStore>('FluencyStore');
      return new SchemaService(fluencyStore);
    },
    'singleton',
  );

  return container;
};
