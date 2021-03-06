import { Personne} from './personne';
import { Adresse } from './adresse';

export class Abonnes extends Personne {
    constructor(public  id?: number,
                public  version?: number,
                public  login?: string,
                public  identifiantUuid?: string,
                public  latitude?: number,
                public  longitude?: number,
                public  password?: string,
                public  type?: string,
                public adresse?: Adresse) {
        super(id, version, login, identifiantUuid, latitude, longitude, password, type, adresse);
    }
}
