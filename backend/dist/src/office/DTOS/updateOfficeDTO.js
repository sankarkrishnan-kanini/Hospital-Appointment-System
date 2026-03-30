"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOfficeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createOfficeDTO_1 = require("./createOfficeDTO");
class UpdateOfficeDto extends (0, mapped_types_1.PartialType)(createOfficeDTO_1.CreateOfficeDto) {
}
exports.UpdateOfficeDto = UpdateOfficeDto;
//# sourceMappingURL=updateOfficeDTO.js.map