"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentStatusDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createAppointmentStatusDTO_1 = require("./createAppointmentStatusDTO");
class UpdateAppointmentStatusDto extends (0, mapped_types_1.PartialType)(createAppointmentStatusDTO_1.CreateAppointmentStatusDto) {
}
exports.UpdateAppointmentStatusDto = UpdateAppointmentStatusDto;
//# sourceMappingURL=updateAppointmentStatusDTO.js.map