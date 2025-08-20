import { AuthService } from '../services/Auth';
import { DependenceInjectionContainer } from '@schematransfer/core';
import { IStore } from 'packages/Core/src/ports/IStore';
import { ProdoctivityClodStore } from '@schematransfer/prodoctivitycloud';
import {ProdoctivityFluencyStore} from '@schematransfer/prodoctivity5';
import { SchemaService } from '../services/Schema';

export let container: DependenceInjectionContainer | undefined = undefined;

export const buildContainer = async () => {
    container = new DependenceInjectionContainer();

    container.register<IStore>('ClodStore', ProdoctivityClodStore)
    container.register<IStore>('FluencyStore', ProdoctivityFluencyStore)

    container.register<AuthService>('AuthServiceCloud', () => {
        const cloudStore = container!.resolve<IStore>('ClodStore')
        return new AuthService(cloudStore);
    }, "singleton")

    container.register<AuthService>('AuthServiceFluency', () => {
        const cloudStore = container!.resolve<IStore>('FluencyStore')
        return new AuthService(cloudStore);
    }, "singleton")

    container.register<SchemaService>('SchemaService', () => {
        const cloudStore = container!.resolve<IStore>('ClodStoreSchema')
        return new SchemaService(cloudStore);
    }, "singleton")
    
    return container;
};