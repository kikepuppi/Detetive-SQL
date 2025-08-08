// db.js

const db = {
  
  // Tabela de Pessoas (expandida)
  pessoas: [
    { id: 1, nome: "Ana Santos", ocupacao: "Estudante de Engenharia", idade: 21, localizacao_atual: 101 },
    { id: 2, nome: "Bruno Costa", ocupacao: "Professor de Eletrônica", idade: 35, localizacao_atual: 102 },
    { id: 3, nome: "Carlos Lima", ocupacao: "Segurança do Evento", idade: 45, localizacao_atual: 101 },
    { id: 4, nome: "Mariana Alves", ocupacao: "Aluna de Pós-Graduação", idade: 25, localizacao_atual: 101 },
    { id: 5, nome: "João Silva", ocupacao: "Ex-aluno e Competidor", idade: 30, localizacao_atual: 103 },
    { id: 6, nome: "Fernanda Ribeiro", ocupacao: "Repórter de Tecnologia", idade: 28, localizacao_atual: 104 },
    { id: 7, nome: "Guilherme Siqueira", ocupacao: "Representante Innovatech", idade: 40, localizacao_atual: 101 },
    { id: 8, nome: "Isabela Cardoso", ocupacao: "Engenheira de Dados", idade: 22, localizacao_atual: 101 },
    { id: 9, nome: "Pedro Rocha", ocupacao: "Estudante de Computação", idade: 20, localizacao_atual: 103 },
    { id: 10, nome: "Juliana Mendes", ocupacao: "Organizadora do Evento", idade: 32, localizacao_atual: 102 },
    { id: 11, nome: "Rafael Souza", ocupacao: "Curioso", idade: 18, localizacao_atual: 101 },
    { id: 12, nome: "Patrícia Gomes", ocupacao: "Estudante de Robótica", idade: 21, localizacao_atual: 104 },
    { id: 13, nome: "Daniel Oliveira", ocupacao: "Convidado Especial", idade: 50, localizacao_atual: 103 },
    { id: 14, nome: "Laura Martins", ocupacao: "Jornalista Freelancer", idade: 26, localizacao_atual: 101 }
  ],
  
  // Tabela de Locais (alguns para não ficar demais)
  locais: [
    { id: 101, nome: "Laboratório de Robótica", capacidade: 30, descricao: "Local com muitos computadores. O crime ocorreu aqui." },
    { id: 102, nome: "Auditório Principal", capacidade: 200, descricao: "Onde as palestras foram realizadas." },
    { id: 103, nome: "Cafeteria", capacidade: 50, descricao: "Ponto de encontro e descanso." },
    { id: 104, nome: "Área de Exposição", capacidade: 100, descricao: "Onde as organizações estudantis exibem seus projetos." },
    { id: 105, nome: "Hall de Entrada", capacidade: 50, descricao: "Local de check-in e onde visitantes se reúnem." }
  ],
  
  // Tabela de Crimes
  crimes: [
    { id: 1, descricao: "Roubo do chip 'Quantum Core' do Laboratório de Robótica.", local_id: 101, hora_do_crime: "14:30" }
  ],

  // Tabela de Eventos (log de câmera, alibis, etc.)
  eventos: [
    { id: 1, pessoa_id: 2, local_id: 102, hora: "14:15", tipo: "palestra" },
    { id: 2, pessoa_id: 5, local_id: 103, hora: "14:20", tipo: "compra de café" },
    { id: 3, pessoa_id: 3, local_id: 101, hora: "14:00", tipo: "patrulha" },
    { id: 4, pessoa_id: 1, local_id: 101, hora: "14:25", tipo: "pesquisa" },
    { id: 5, pessoa_id: 6, local_id: 104, hora: "14:35", tipo: "entrevista" },
    { id: 6, pessoa_id: 7, local_id: 101, hora: "14:28", tipo: "preparação para palestra" },
    { id: 7, pessoa_id: 9, local_id: 103, hora: "14:28", tipo: "compra de lanche" },
    { id: 8, pessoa_id: 11, local_id: 101, hora: "14:31", tipo: "observação" },
    { id: 9, pessoa_id: 14, local_id: 101, hora: "14:29", tipo: "fazendo anotações" },
    { id: 10, pessoa_id: 12, local_id: 104, hora: "14:20", tipo: "exibição do robô" },
    { id: 11, pessoa_id: 10, local_id: 102, hora: "14:25", tipo: "conferindo o som" },
    { id: 12, pessoa_id: 8, local_id: 101, hora: "14:32", tipo: "conversa com segurança" },
    { id: 13, pessoa_id: 5, local_id: 101, hora: "14:34", tipo: "conversa com professor" }
  ],
  
  // Tabela de Históricos Profissionais (completa)
  historicos: [
    { id: 1, pessoa_id: 1, empresa: "None", cargo: "Estudante" },
    { id: 2, pessoa_id: 2, empresa: "Insper", cargo: "Professor" },
    { id: 3, pessoa_id: 3, empresa: "EventSecure", cargo: "Segurança" },
    { id: 4, pessoa_id: 4, empresa: "Insper", cargo: "Pesquisadora" },
    { id: 5, pessoa_id: 5, empresa: "TechSolutions Inc.", cargo: "Engenheiro de Software" },
    { id: 6, pessoa_id: 6, empresa: "Jornal do Vale", cargo: "Repórter" },
    { id: 7, pessoa_id: 7, empresa: "Innovatech Solutions", cargo: "Representante de Vendas" },
    { id: 8, pessoa_id: 8, empresa: "Competidora", cargo: "Engenheira de Dados" },
    { id: 9, pessoa_id: 9, empresa: "None", cargo: "Estudante" },
    { id: 10, pessoa_id: 10, empresa: "Insper", cargo: "Organizadora de Eventos" },
    { id: 11, pessoa_id: 11, empresa: "None", cargo: "Visitante" },
    { id: 12, pessoa_id: 12, empresa: "Insper", cargo: "Estudante" },
    { id: 13, pessoa_id: 13, empresa: "None", cargo: "Convidado" },
    { id: 14, pessoa_id: 14, empresa: "Freelancer", cargo: "Jornalista" }
  ]
};