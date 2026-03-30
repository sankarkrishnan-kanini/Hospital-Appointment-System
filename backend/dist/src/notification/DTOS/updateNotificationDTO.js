"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createNotificationDTO_1 = require("./createNotificationDTO");
class UpdateNotificationDto extends (0, mapped_types_1.PartialType)(createNotificationDTO_1.CreateNotificationDto) {
}
exports.UpdateNotificationDto = UpdateNotificationDto;
//# sourceMappingURL=updateNotificationDTO.js.map