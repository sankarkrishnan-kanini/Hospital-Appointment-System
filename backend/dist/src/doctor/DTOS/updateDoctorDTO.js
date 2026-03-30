"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createDoctorDTO_1 = require("./createDoctorDTO");
class UpdateDoctorDto extends (0, mapped_types_1.PartialType)(createDoctorDTO_1.CreateDoctorDto) {
}
exports.UpdateDoctorDto = UpdateDoctorDto;
//# sourceMappingURL=updateDoctorDTO.js.map