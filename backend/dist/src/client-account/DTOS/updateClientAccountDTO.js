"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientAccountDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createClientAccountDTO_1 = require("./createClientAccountDTO");
class UpdateClientAccountDto extends (0, mapped_types_1.PartialType)(createClientAccountDTO_1.CreateClientAccountDto) {
}
exports.UpdateClientAccountDto = UpdateClientAccountDto;
//# sourceMappingURL=updateClientAccountDTO.js.map