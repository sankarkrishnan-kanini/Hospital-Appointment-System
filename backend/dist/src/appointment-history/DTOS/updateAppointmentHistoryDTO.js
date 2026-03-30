"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentHistoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createAppointmentHistoryDTO_1 = require("./createAppointmentHistoryDTO");
class UpdateAppointmentHistoryDto extends (0, mapped_types_1.PartialType)(createAppointmentHistoryDTO_1.CreateAppointmentHistoryDto) {
}
exports.UpdateAppointmentHistoryDto = UpdateAppointmentHistoryDto;
//# sourceMappingURL=updateAppointmentHistoryDTO.js.map