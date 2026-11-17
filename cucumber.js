// Configuração do Cucumber
// Cada integrante tem a própria pasta com features/, steps/ e evidencias/
//
//   npm test               -> roda os cenários de todos
//   npm run test:heitor    -> roda só os cenários do Heitor (vale para qualquer nome)

const integrantes = ['mariana', 'yasmin', 'gabriela', 'joao', 'heitor', 'josue'];

// Os steps de todos são carregados sempre, porque no Cucumber os passos
// são globais (um mesmo "Dado ..." pode ser reaproveitado entre pastas)
const steps = integrantes.map(nome => `${nome}/steps/**/*.js`);

const perfil = (pastas) => ({
    paths: pastas.map(nome => `${nome}/features/**/*.feature`),
    require: steps,
    format: ['pretty']
});

const perfis = { default: perfil(integrantes) };
for (const nome of integrantes) {
    perfis[nome] = perfil([nome]);
}

module.exports = perfis;
