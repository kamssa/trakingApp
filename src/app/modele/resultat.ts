export class Resultat<T> {

    constructor(public statut: number,
                public messages: string[],
                public body: T
    ) {

    }


}
