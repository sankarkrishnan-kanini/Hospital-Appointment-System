"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHospitalAffiliationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createHospitalAffiliationDTO_1 = require("./createHospitalAffiliationDTO");
class UpdateHospitalAffiliationDto extends (0, mapped_types_1.PartialType)(createHospitalAffiliationDTO_1.CreateHospitalAffiliationDto) {
}
exports.UpdateHospitalAffiliationDto = UpdateHospitalAffiliationDto;
//# sourceMappingURL=updateHospitalAffiliationDTO.js.map