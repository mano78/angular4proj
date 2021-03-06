import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss']
})
export class DishDetailComponent implements OnInit {

  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  comment: Comment;
  commentForm: FormGroup;
  errMess: string;
  

  formErrors = {
    'author' : '',
    'rating' : '',
    'comment' : ''
  };

  validationMessages = {
    'author' : {
      'required' : 'Name is required',
      'minlength' : 'Name must be at least 2 characters long',
      'maxlength' : 'Name cannot be more that 25 characters long'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
      'maxlength':     'Comment cannot be more than 25 characters long.'
    },
  };

  constructor(private dishservice: DishService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish;  this.setPrevNext(dish.id); },
        errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(25) ] ],
      rating: 5,
      comment: ['', [ Validators.required, Validators.minLength(2) ] ],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }
  
  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }
  
  goBack(): void {
    this.location.back();
  }

  onValueChanged(commentFormData?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }

    if (this.commentForm.valid) {
      this.comment = this.commentForm.value;
    } else {
      this.comment = undefined;
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment['date'] = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });
    this.commentForm.reset({
        author: '',
        rating: 5,
        comment: ''
    });
  }


}
