const lineRepository = require('./line_repositories.js');

const appError = require('../../utils/appError.js');

async function getAllLine(company_id) {
  return await lineRepository.getLineByCompany(company_id);
}

async function getLine(code, company_id) {
  const line= await lineRepository.getLineById(code, company_id);
  if (!line) throw appError('LINE_NOT_FOUND', 404);

  return line;
}

async function addLine(company_id, data) {
  const { name_line, color} = data;
  return await lineRepository.addLine(company_id, name_line, color);
}

async function updateLine(code, company_id, data) {
  const line= await lineRepository.updateLine(code, company_id, data);
  if (!line) throw appError('LINE_NOT_FOUND', 404);
  return line;
}

async function deleteLine(code, company_id) {
  const line= await lineRepository.deleteLine(code, company_id);
  if (!line) throw appError('LINE_NOT_FOUND', 404);
}

module.exports = { getAllLine, getLine, addLine, updateLine, deleteLine};