import * as index from '../index';

describe('city.spec.js', () => {
    describe('normalizeSubject', () => {
        expect(index.BH.normalizeSubject(
            'Palestra em Belo Horizonte/MG  - “Alquimia - O Segredo da Transformação”'
        )).toBe('Palestra em Belo Horizonte: Alquimia - O Segredo da Transformação');

        expect(index.BH.normalizeSubject(
            'Palestra em belo horizonte/MG  - “Alquimia - O Segredo da Transformação”'
        )).toBe('Palestra em Belo Horizonte: Alquimia - O Segredo da Transformação');

        expect(index.BH.normalizeSubject(
            'Palestra em belo Horizonte/MG  - “Alquimia - O Segredo da Transformação”'
        )).toBe('Palestra em Belo Horizonte: Alquimia - O Segredo da Transformação');

        expect(index.BH.normalizeSubject(
            '   Palestra    em Belo Horizonte  / MG   -   “Alquimia - O Segredo da Transformação ”'
        )).toBe('Palestra em Belo Horizonte: Alquimia - O Segredo da Transformação');


        expect(index.LS.normalizeSubject(
            'Palestra em Lagoa Santa/MG  - “Alquimia - O Segredo da Transformação”'
        )).toBe('Palestra em Lagoa Santa: Alquimia - O Segredo da Transformação');

        expect(index.LS.normalizeSubject(
            '   Palestra    em Lagoa Santa  / MG   -   “Alquimia - O Segredo da Transformação ”'
        )).toBe('Palestra em Lagoa Santa: Alquimia - O Segredo da Transformação');


        expect(index.DIV.normalizeSubject(
            'Palestra em divinopolis/MG  - “Alquimia - O Segredo da Transformação”'
        )).toBe('Palestra em Divinopolis: Alquimia - O Segredo da Transformação');

        expect(index.DIV.normalizeSubject(
            'Palestra em divinópolis/MG  - “Alquimia - O Segredo da Transformação”'
        )).toBe('Palestra em Divinópolis: Alquimia - O Segredo da Transformação');

        expect(index.DIV.normalizeSubject(
            '   Palestra    em divinopolis  / MG   -   “Alquimia - O Segredo da Transformação ”'
        )).toBe('Palestra em Divinopolis: Alquimia - O Segredo da Transformação');
    });
});