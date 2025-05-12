import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Schedule } from '../models/schedule.model';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-schedule-manager',
  imports: [ReactiveFormsModule, NgIf, NgFor, DatePipe],
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss']
})
export class ScheduleManagerComponent implements OnInit {
  schedules: Schedule[] = [];
  scheduleForm: FormGroup;

  constructor(private scheduleService: ScheduleService, private fb: FormBuilder) {
    this.scheduleForm = this.fb.group({
      name: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.scheduleService.getSchedules().subscribe(schedules => {
      this.schedules = schedules;
    });
  }

  addSchedule(): void {
    if (this.scheduleForm.valid) {
      const newSchedule: Schedule = {
        name: this.scheduleForm.value.name,
        startTime: new Date(this.scheduleForm.value.startTime),
        endTime: new Date(this.scheduleForm.value.endTime),
        description: this.scheduleForm.value.description
      };
      this.scheduleService.addSchedule(newSchedule);
      this.scheduleForm.reset();
    }
  }
}