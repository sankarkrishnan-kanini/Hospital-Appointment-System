"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorSpecializationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createDoctorSpecializationDTO_1 = require("./createDoctorSpecializationDTO");
class UpdateDoctorSpecializationDto extends (0, mapped_types_1.PartialType)(createDoctorSpecializationDTO_1.CreateDoctorSpecializationDto) {
}
exports.UpdateDoctorSpecializationDto = UpdateDoctorSpecializationDto;
//# sourceMappingURL=updateDoctorSpecializationDTO.js.map