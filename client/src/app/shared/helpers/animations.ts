import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeInOut = trigger(
  'fadeInOut',
  [
    transition(':enter', [style({ opacity: 0 }), animate('0.4s ease-in', style({ opacity: 1 }))]),
    transition(':leave', [animate('0.4s 10ms ease-out', style({ opacity: 0 }))])
  ]);

export const horizontalInOutAnimation = trigger(
  'horizontalInOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ width: 0 }),
        animate('0.1s', style({ width: '*' }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ width: '*' }),
        animate('0.1s', style({ width: 0 })),
      ]
    )
  ]
);

export const verticalInOutAnimation = trigger(
  'verticalInOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ height: 0 }),
        animate('0.1s', style({ height: '*' }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ height: '*' }),
        animate('0.1s', style({ height: 0 })),
      ]
    )
  ]
);

export const flyInOut = trigger(
  'flyInOut',
  [
    state('*', style({
      opacity: 1,
      transform: 'translateX(0)'
    })),
    transition(':enter', [
      style({
        transform: 'translateX(-100%)',
        opacity: 0
      }),
      animate('500ms ease-in')
    ]),
    transition(':leave', [
      animate('500ms ease-out', style({
        transform: 'translateX(100%)',
        opacity: 0
      }))
    ])
  ]
);

export const expandVerticalAnimation = trigger(
  'expandVertical',
  [
    state('open', style({
      height: '*',
    })),
    state('closed', style({
      display: 'none',
      height: 0,
    })),
    transition('open => closed', [
      animate('250ms ease-out'),
    ]),
    transition('closed => open', [
      style({
        display: '*',
      }),
      animate('250ms ease-in'),
    ]),
  ]
);
