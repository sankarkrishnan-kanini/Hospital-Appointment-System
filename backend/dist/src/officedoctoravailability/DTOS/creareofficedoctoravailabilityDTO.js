"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createofficedoctoravailabilityDTO = void 0;
const class_validator_1 = require("class-validator");
class createofficedoctoravailabilityDTO {
    office_id;
    day_of_week;
    start_time;
    end_time;
    is_available;
    reason_of_unavailability;
}
exports.createofficedoctoravailabilityDTO = createofficedoctoravailabilityDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], createofficedoctoravailabilityDTO.prototype, "office_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createofficedoctoravailabilityDTO.prototype, "day_of_week", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
    __metadata("design:type", String)
], createofficedoctoravailabilityDTO.prototype, "start_time", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
    __metadata("design:type", String)
], createofficedoctoravailabilityDTO.prototype, "end_time", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], createofficedoctoravailabilityDTO.prototype, "is_available", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createofficedoctoravailabilityDTO.prototype, "reason_of_unavailability", void 0);
//# sourceMappingURL=creareofficedoctoravailabilityDTO.js.map