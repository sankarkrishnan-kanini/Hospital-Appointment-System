"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createAppointmentDTO_1 = require("./createAppointmentDTO");
class UpdateAppointmentDto extends (0, mapped_types_1.PartialType)(createAppointmentDTO_1.CreateAppointmentDto) {
}
exports.UpdateAppointmentDto = UpdateAppointmentDto;
//# sourceMappingURL=updateAppointmentDTO.js.map