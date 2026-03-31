"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const appointment_module_1 = require("./appointment/appointment.module");
const appointment_history_module_1 = require("./appointment-history/appointment-history.module");
const client_account_module_1 = require("./client-account/client-account.module");
const doctor_module_1 = require("./doctor/doctor.module");
const doctor_document_module_1 = require("./doctor-document/doctor-document.module");
const appointment_status_module_1 = require("./appointment-status/appointment-status.module");
const doctor_specialization_module_1 = require("./doctor-specialization/doctor-specialization.module");
const doctor_unavailability_module_1 = require("./doctor-unavailability/doctor-unavailability.module");
const hospital_affiliation_module_1 = require("./hospital-affiliation/hospital-affiliation.module");
const in_network_insurance_module_1 = require("./in-network-insurance/in-network-insurance.module");
const notification_module_1 = require("./notification/notification.module");
const office_module_1 = require("./office/office.module");
const officedoctoravailability_module_1 = require("./officedoctoravailability/officedoctoravailability.module");
const time_slot_module_1 = require("./time-slot/time-slot.module");
const prisma_service_1 = require("./prisma/prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [appointment_module_1.AppointmentModule, appointment_history_module_1.AppointmentHistoryModule, client_account_module_1.ClientAccountModule, doctor_module_1.DoctorModule, doctor_document_module_1.DoctorDocumentModule, appointment_status_module_1.AppointmentStatusModule, doctor_specialization_module_1.DoctorSpecializationModule, doctor_unavailability_module_1.DoctorUnavailabilityModule, hospital_affiliation_module_1.HospitalAffiliationModule, in_network_insurance_module_1.InNetworkInsuranceModule, notification_module_1.NotificationModule, office_module_1.OfficeModule, officedoctoravailability_module_1.OfficedoctoravailabilityModule, time_slot_module_1.TimeSlotModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map