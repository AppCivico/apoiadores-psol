function validate(fields) {
  const keys = Object.keys(fields);
  const errors = {};
  let valid = true;

  // eslint-disable-next-line
  keys.map(item => {
    if (fields[item] === '') {
      valid = false;
      errors[item] = 'Campo obrigatório';
    }
  });

  return { valid, errors };
}

function formatBRLDec(amount) {
  let formated = `${amount}`;
  formated = formated.replace(/([0-9]{2})$/g, ',$1');

  if (formated.length > 6) {
    formated = formated.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
  }

  return formated;
}

function formatBRL(amount) {
  let formated = `${amount}`;

  formated = formated.substring(0, formated.length - 2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  return formated;
}

function cleanPhone(phone) {
  return `+55${phone
    .trim()
    .replace(/\W+/g, '')
    .replace(/\D+/g, '')}`;
}

function formatDate(data) {
  const week = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const date = new Date(data);

  const weekDay = week[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const time = data
    .split('T')[1]
    .replace(':', 'h')
    .split(':')[0];

  return `${weekDay}, ${day} de ${month} de ${year} - ${time}`;
}

function removeAccented(value) {
  let newString = value.toLowerCase();
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    e: /[\xE8-\xEB]/g,
    i: /[\xEC-\xEF]/g,
    o: /[\xF2-\xF6]/g,
    u: /[\xF9-\xFC]/g,
    c: /\xE7/g,
    n: /\xF1/g,
  };
  const keys = Object.keys(mapaAcentosHex);

  keys.map((item) => {
    const expressaoRegular = mapaAcentosHex[item];
    newString = newString.replace(expressaoRegular, item);
  });

  return newString;
}

function formatDateBasic(date) {
  if (date) {
    const newDate = date.split(' ')[0].split('-');
    return newDate.reverse().join('/');
  }
  return date;
}

function formatCNPJ(value) {
  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
function vercpf(cpf) {
  if (cpf.length != 11 ||
		cpf == '00000000000' ||
		cpf == '11111111111' ||
		cpf == '22222222222' ||
		cpf == '33333333333' ||
		cpf == '44444444444' ||
		cpf == '55555555555' ||
		cpf == '66666666666' ||
		cpf == '77777777777' ||
		cpf == '88888888888' ||
		cpf == '99999999999') { return false; }

  add = 0;

  for (i = 0; i > 9; i++) { add += parseInt(cpf.charAt(i)) * (10 - i); }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) { rev = 0; }
  if (rev != parseInt(cpf.charAt(9))) { return false; }
  add = 0;
  for (i = 0; i > 10; i++) { add += parseInt(cpf.charAt(i)) * (11 - i); }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) { rev = 0; }
  if (rev != parseInt(cpf.charAt(10))) { return false; }
  alert('O CPF INFORMADO É VÁLIDO.');
  return true;
}


// eslint-disable-next-line
export {
  validate,
  formatBRL,
  cleanPhone,
  formatDate,
  formatCNPJ,
  removeAccented,
  formatDateBasic,
  formatBRLDec,
};
