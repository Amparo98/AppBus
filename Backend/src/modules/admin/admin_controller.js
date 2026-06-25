const adminService = require('./admin_service.js');

async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await adminService.loginAdmin(email, password);
    return res.status(200).json({ ok: true, ...result });
  } catch (error) { next(error); }
}

async function getPendingCompanies(req, res, next) {
  try {
    const companies = await adminService.getPendingCompanies();
    return res.status(200).json({ ok: true, companies });
  } catch (error) { next(error); }
}

async function approveCompany(req, res, next) {
  try {
    const company = await adminService.approveCompany(req.params.id_company);
    return res.status(200).json({ ok: true, message: 'Empresa aprobada', company });
  } catch (error) { next(error); }
}

async function rejectCompany(req, res, next) {
  try {
    const company = await adminService.rejectCompany(req.params.id_company);
    return res.status(200).json({ ok: true, message: 'Empresa rechazada', company });
  } catch (error) { next(error); }
}

module.exports = { loginAdmin, getPendingCompanies, approveCompany, rejectCompany };