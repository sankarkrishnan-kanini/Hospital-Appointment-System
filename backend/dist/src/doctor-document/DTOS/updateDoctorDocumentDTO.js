"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorDocumentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createDoctorDocumentDTO_1 = require("./createDoctorDocumentDTO");
class UpdateDoctorDocumentDto extends (0, mapped_types_1.PartialType)(createDoctorDocumentDTO_1.CreateDoctorDocumentDto) {
}
exports.UpdateDoctorDocumentDto = UpdateDoctorDocumentDto;
//# sourceMappingURL=updateDoctorDocumentDTO.js.map