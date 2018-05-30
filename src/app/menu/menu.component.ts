import { Component, OnInit } from '@angular/core';
//commenting below as we are using services
//import { Dish } from '../shared/dish';
//import {DISHES} from '../shared/dishes';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];

  selectedDish: Dish;


  constructor(private dishservice:DishService) { }

  ngOnInit() {
    this.dishes = this.dishservice.getDishes();
  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }

}
