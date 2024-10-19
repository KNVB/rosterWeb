import AutoPlan from "./AutoPlanner";
export default function TestAutoPlan() {
    let endDate = 8;
    let essentialShift = "abc";
    let itoIdList = [
        "ITO1_1999-01-01",
        "ITO5_2021-09-09",
        "ITO6_1999-01-01",
        "ITO8_1999-01-01"
    ];
    let iterationCount = 2;
    let itoBlackListShiftPattern = {
        "ITO1_1999-01-01": [
            "b,a",
            "c,a",
            "c,b",
            "c,c,c"
        ],
        "ITO3_2023-07-12": [
            "b,a",
            "c,a",
            "c,b",
            "c,c,c"
        ],
        "ITO4_1999-01-01": [
            "c,a",
            "c,b",
            "c,c"
        ],
        "ITO5_2021-09-09": [
            "b,a",
            "c,a",
            "c,b",
            "c,c,c"
        ],
        "ITO6_1999-01-01": [
            "b,a",
            "c,a",
            "c,b",
            "c,c,c"
        ],
        "ITO8_1999-01-01": [
            "b,a",
            "c,a",
            "c,b",
            "c,c,c"
        ]
    };
    let preferredShiftList = {
        "ITO1_1999-01-01": {
            "1": [
                {
                    "shiftType": "c"
                }
            ],
            "2": [
                {
                    "shiftType": "o"
                }
            ],
            "3": [
                {
                    "shiftType": "o"
                }
            ],
            "7": [
                {
                    "shiftType": "c"
                }
            ],
            "8": [
                {
                    "shiftType": "c"
                }
            ],
            "9": [
                {
                    "shiftType": "o"
                }
            ],
            "10": [
                {
                    "shiftType": "o"
                }
            ],
            "15": [
                {
                    "shiftType": "nc"
                }
            ],
            "16": [
                {
                    "shiftType": "d1"
                }
            ],
            "17": [
                {
                    "shiftType": "o"
                }
            ],
            "18": [
                {
                    "shiftType": "o"
                }
            ],
            "19": [
                {
                    "shiftType": "nc"
                }
            ],
            "20": [
                {
                    "shiftType": "na"
                }
            ],
            "21": [
                {
                    "shiftType": "c"
                }
            ],
            "22": [
                {
                    "shiftType": "c"
                }
            ],
            "28": [
                {
                    "shiftType": "c"
                }
            ],
            "29": [
                {
                    "shiftType": "c"
                }
            ],
            "30": [
                {
                    "shiftType": "o"
                }
            ]
        },
        "ITO5_2021-09-09": {
            "6": [
                {
                    "shiftType": "a"
                }
            ],
            "7": [
                {
                    "shiftType": "o"
                }
            ],
            "8": [
                {
                    "shiftType": "c"
                }
            ],
            "14": [
                {
                    "shiftType": "a"
                }
            ],
            "20": [
                {
                    "shiftType": "a"
                }
            ],
            "21": [
                {
                    "shiftType": "o"
                }
            ],
            "22": [
                {
                    "shiftType": "o"
                }
            ],
            "23": [
                {
                    "shiftType": "o"
                }
            ],
            "24": [
                {
                    "shiftType": "c"
                }
            ],
            "27": [
                {
                    "shiftType": "a"
                }
            ],
            "29": [
                {
                    "shiftType": "a"
                }
            ]
        },
        "ITO6_1999-01-01": {
            "6": [
                {
                    "shiftType": "nc"
                }
            ],
            "7": [
                {
                    "shiftType": "nc"
                }
            ],
            "13": [
                {
                    "shiftType": "nc"
                }
            ],
            "14": [
                {
                    "shiftType": "nc"
                }
            ],
            "17": [
                {
                    "shiftType": "nc"
                }
            ],
            "19": [
                {
                    "shiftType": "a"
                }
            ],
            "20": [
                {
                    "shiftType": "d1"
                }
            ],
            "21": [
                {
                    "shiftType": "nc"
                }
            ],
            "22": [
                {
                    "shiftType": "a"
                }
            ],
            "23": [
                {
                    "shiftType": "d1"
                }
            ],
            "27": [
                {
                    "shiftType": "nc"
                }
            ],
            "28": [
                {
                    "shiftType": "nc"
                }
            ]
        },
        "ITO7_2024-04-12": {
            "20": [
                {
                    "shiftType": "d1"
                }
            ]
        },
        "ITO8_1999-01-01": {
            "3": [
                {
                    "shiftType": "nc"
                }
            ],
            "4": [
                {
                    "shiftType": "o"
                }
            ],
            "5": [
                {
                    "shiftType": "o"
                }
            ],
            "11": [
                {
                    "shiftType": "o"
                }
            ],
            "12": [
                {
                    "shiftType": "o"
                }
            ],
            "18": [
                {
                    "shiftType": "o"
                }
            ],
            "19": [
                {
                    "shiftType": "o"
                }
            ],
            "20": [
                {
                    "shiftType": "d1"
                }
            ],
            "25": [
                {
                    "shiftType": "b"
                }
            ],
            "26": [
                {
                    "shiftType": "o"
                }
            ],
            "27": [
                {
                    "shiftType": "al"
                }
            ],
            "28": [
                {
                    "shiftType": "al"
                }
            ],
            "29": [
                {
                    "shiftType": "al"
                }
            ],
            "30": [
                {
                    "shiftType": "al"
                }
            ]
        }
    }
    let previousMonthShiftList = {
        "ITO1_1999-01-01": [
            {
                "shiftType": "O"
            },
            {
                "shiftType": "c"
            },
            {
                "shiftType": "c"
            },
            {
                "shiftType": "O"
            },
            {
                "shiftType": "a"
            },
            {
                "shiftType": "b"
            }
        ],
        "ITO3_2023-07-12": [
            {
                "shiftType": "a"
            },
            {
                "shiftType": "a"
            },
            {
                "shiftType": "a"
            },
            {
                "shiftType": "a"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "O"
            }
        ],
        "ITO4_1999-01-01": [
            {
                "shiftType": "d3"
            },
            {
                "shiftType": "d3"
            },
            {
                "shiftType": "d3"
            },
            {
                "shiftType": "d3"
            },
            {
                "shiftType": "d3"
            },
            {
                "shiftType": "O"
            }
        ],
        "ITO5_2021-09-09": [
            {
                "shiftType": "O"
            },
            {
                "shiftType": "O"
            },
            {
                "shiftType": "O"
            },
            {
                "shiftType": "O"
            },
            {
                "shiftType": "c"
            },
            {
                "shiftType": "O"
            }
        ],
        "ITO6_1999-01-01": [
            {
                "shiftType": "c"
            },
            {
                "shiftType": "O"
            },
            {
                "shiftType": "O"
            },
            {
                "shiftType": "c"
            },
            {
                "shiftType": "O"
            },
            {
                "shiftType": "a"
            }
        ],
        "ITO7_2024-04-12": [
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "O"
            }
        ],
        "ITO8_1999-01-01": [
            {
                "shiftType": "b"
            },
            {
                "shiftType": "b"
            },
            {
                "shiftType": "b"
            },
            {
                "shiftType": "b"
            },
            {
                "shiftType": "b"
            },
            {
                "shiftType": "c"
            }
        ],
        "ITO9_2024-02-19": [
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "d2"
            },
            {
                "shiftType": "O"
            }
        ]
    };
    let roster = {
        "ITO1_1999-01-01": {
            "availableShiftList": [
                "a",
                "b",
                "c",
                "d1",
                "O",
                "d2",
                "t"
            ],
            "dutyPattern": "operator",
            "itoName": "TSANG Ka Shing Gary",
            "itoPostName": "ITO1",
            "lastMonthBalance": 27.45,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "c"
                    }
                ],
                "2": [
                    {
                        "shiftType": "O"
                    }
                ],
                "3": [
                    {
                        "shiftType": "O"
                    }
                ],
                "4": [
                    {
                        "shiftType": "b"
                    }
                ],
                "5": [
                    {
                        "shiftType": "b"
                    }
                ],
                "6": [
                    {
                        "shiftType": "c"
                    }
                ],
                "7": [
                    {
                        "shiftType": "c"
                    }
                ],
                "8": [
                    {
                        "shiftType": "O"
                    }
                ],
                "9": [
                    {
                        "shiftType": "O"
                    }
                ],
                "10": [
                    {
                        "shiftType": "O"
                    }
                ],
                "11": [
                    {
                        "shiftType": "b"
                    }
                ],
                "12": [
                    {
                        "shiftType": "O"
                    }
                ],
                "13": [
                    {
                        "shiftType": "O"
                    }
                ],
                "14": [
                    {
                        "shiftType": "b"
                    }
                ],
                "15": [
                    {
                        "shiftType": "b"
                    }
                ],
                "16": [
                    {
                        "shiftType": "d1"
                    }
                ],
                "17": [
                    {
                        "shiftType": "O"
                    }
                ],
                "18": [
                    {
                        "shiftType": "O"
                    }
                ],
                "19": [
                    {
                        "shiftType": "b"
                    }
                ],
                "20": [
                    {
                        "shiftType": "c"
                    }
                ],
                "21": [
                    {
                        "shiftType": "O"
                    }
                ],
                "22": [
                    {
                        "shiftType": "b"
                    }
                ],
                "23": [
                    {
                        "shiftType": "b"
                    }
                ],
                "24": [
                    {
                        "shiftType": "c"
                    }
                ],
                "25": [
                    {
                        "shiftType": "O"
                    }
                ],
                "26": [
                    {
                        "shiftType": "O"
                    }
                ],
                "27": [
                    {
                        "shiftType": "c"
                    }
                ],
                "28": [
                    {
                        "shiftType": "c"
                    }
                ],
                "29": [
                    {
                        "shiftType": "c"
                    }
                ],
                "30": [
                    {
                        "shiftType": "O"
                    }
                ]
            },
            "thisMonthBalance": -16,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 17,
            "actualWorkingHour": 140,
            "aShiftCount": 0,
            "bxShiftCount": 8,
            "cShiftCount": 8,
            "dxShiftCount": 1,
            "expectedWorkingHour": 156,
            "extraHour": 0,
            "totalBalance": 11.45
        },
        "ITO2_2024-08-12": {
            "availableShiftList": [
                "O",
                "d",
                "a",
                "t"
            ],
            "dutyPattern": "day",
            "itoName": "TANG Chi Kwong Ken",
            "itoPostName": "ITO2",
            "lastMonthBalance": 0,
            "shiftList": {},
            "thisMonthBalance": -180,
            "workingHourPerDay": 9,
            "actualWorkingDayCount": 0,
            "actualWorkingHour": 0,
            "aShiftCount": 0,
            "bxShiftCount": 0,
            "cShiftCount": 0,
            "dxShiftCount": 0,
            "expectedWorkingHour": 180,
            "extraHour": 0,
            "totalBalance": -180
        },
        "ITO3_2023-07-12": {
            "availableShiftList": [
                "d1",
                "d2",
                "O",
                "a",
                "t"
            ],
            "dutyPattern": "day",
            "itoName": "TANG Chi Keung Ray",
            "itoPostName": "ITO3",
            "lastMonthBalance": 0,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "O"
                    }
                ],
                "2": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "3": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "4": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "5": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "6": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "7": [
                    {
                        "shiftType": "O"
                    }
                ],
                "8": [
                    {
                        "shiftType": "O"
                    }
                ],
                "9": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "10": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "11": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "12": [
                    {
                        "shiftType": "a"
                    }
                ],
                "13": [
                    {
                        "shiftType": "a"
                    }
                ],
                "14": [
                    {
                        "shiftType": "O"
                    }
                ],
                "15": [
                    {
                        "shiftType": "O"
                    }
                ],
                "16": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "17": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "18": [
                    {
                        "shiftType": "O"
                    }
                ],
                "19": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "20": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "21": [
                    {
                        "shiftType": "O"
                    }
                ],
                "22": [
                    {
                        "shiftType": "a"
                    }
                ],
                "23": [
                    {
                        "shiftType": "a"
                    }
                ],
                "24": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "25": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "26": [
                    {
                        "shiftType": "a"
                    }
                ],
                "27": [
                    {
                        "shiftType": "a"
                    }
                ],
                "28": [
                    {
                        "shiftType": "O"
                    }
                ],
                "29": [
                    {
                        "shiftType": "O"
                    }
                ],
                "30": [
                    {
                        "shiftType": "a"
                    }
                ]
            },
            "thisMonthBalance": 19,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 21,
            "actualWorkingHour": 175,
            "aShiftCount": 7,
            "bxShiftCount": 0,
            "cShiftCount": 0,
            "dxShiftCount": 14,
            "expectedWorkingHour": 156,
            "extraHour": 0,
            "totalBalance": 19
        },
        "ITO4_1999-01-01": {
            "availableShiftList": [
                "a",
                "b",
                "c",
                "d1",
                "O",
                "d2",
                "t"
            ],
            "dutyPattern": "operator",
            "itoName": "HUEN Kwai Leung Andrew",
            "itoPostName": "ITO4",
            "lastMonthBalance": -0.1,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "2": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "3": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "4": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "5": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "6": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "7": [
                    {
                        "shiftType": "O"
                    }
                ],
                "8": [
                    {
                        "shiftType": "O"
                    }
                ],
                "9": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "10": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "11": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "12": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "13": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "14": [
                    {
                        "shiftType": "O"
                    }
                ],
                "15": [
                    {
                        "shiftType": "O"
                    }
                ],
                "16": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "17": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "18": [
                    {
                        "shiftType": "O"
                    }
                ],
                "19": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "20": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "21": [
                    {
                        "shiftType": "O"
                    }
                ],
                "22": [
                    {
                        "shiftType": "O"
                    }
                ],
                "23": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "24": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "25": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "26": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "27": [
                    {
                        "shiftType": "d3"
                    }
                ],
                "28": [
                    {
                        "shiftType": "O"
                    }
                ],
                "29": [
                    {
                        "shiftType": "O"
                    }
                ],
                "30": [
                    {
                        "shiftType": "d3"
                    }
                ]
            },
            "thisMonthBalance": -156,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 0,
            "actualWorkingHour": 0,
            "aShiftCount": 0,
            "bxShiftCount": 0,
            "cShiftCount": 0,
            "dxShiftCount": 0,
            "expectedWorkingHour": 156,
            "extraHour": 0,
            "totalBalance": -156.1
        },
        "ITO5_2021-09-09": {
            "availableShiftList": [
                "a",
                "b",
                "c",
                "d1",
                "O",
                "t"
            ],
            "dutyPattern": "operator",
            "itoName": "YIM Man Hong",
            "itoPostName": "ITO5",
            "lastMonthBalance": -55,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "b"
                    }
                ],
                "2": [
                    {
                        "shiftType": "c"
                    }
                ],
                "3": [
                    {
                        "shiftType": "c"
                    }
                ],
                "4": [
                    {
                        "shiftType": "O"
                    }
                ],
                "5": [
                    {
                        "shiftType": "O"
                    }
                ],
                "6": [
                    {
                        "shiftType": "a"
                    }
                ],
                "7": [
                    {
                        "shiftType": "O"
                    }
                ],
                "8": [
                    {
                        "shiftType": "b"
                    }
                ],
                "9": [
                    {
                        "shiftType": "b"
                    }
                ],
                "10": [
                    {
                        "shiftType": "b"
                    }
                ],
                "11": [
                    {
                        "shiftType": "c"
                    }
                ],
                "12": [
                    {
                        "shiftType": "c"
                    }
                ],
                "13": [
                    {
                        "shiftType": "O"
                    }
                ],
                "14": [
                    {
                        "shiftType": "a"
                    }
                ],
                "15": [
                    {
                        "shiftType": "c"
                    }
                ],
                "16": [
                    {
                        "shiftType": "O"
                    }
                ],
                "17": [
                    {
                        "shiftType": "c"
                    }
                ],
                "18": [
                    {
                        "shiftType": "c"
                    }
                ],
                "19": [
                    {
                        "shiftType": "c"
                    }
                ],
                "20": [
                    {
                        "shiftType": "O"
                    }
                ],
                "21": [
                    {
                        "shiftType": "O"
                    }
                ],
                "22": [
                    {
                        "shiftType": "O"
                    }
                ],
                "23": [
                    {
                        "shiftType": "O"
                    }
                ],
                "24": [
                    {
                        "shiftType": "O"
                    }
                ],
                "25": [
                    {
                        "shiftType": "a"
                    }
                ],
                "26": [
                    {
                        "shiftType": "b"
                    }
                ],
                "27": [
                    {
                        "shiftType": "b"
                    }
                ],
                "28": [
                    {
                        "shiftType": "O"
                    }
                ],
                "29": [
                    {
                        "shiftType": "a"
                    }
                ],
                "30": [
                    {
                        "shiftType": "b"
                    }
                ]
            },
            "thisMonthBalance": 6.25,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 19,
            "actualWorkingHour": 162.25,
            "aShiftCount": 4,
            "bxShiftCount": 7,
            "cShiftCount": 8,
            "dxShiftCount": 0,
            "expectedWorkingHour": 156,
            "extraHour": 0,
            "totalBalance": -48.75
        },
        "ITO6_1999-01-01": {
            "availableShiftList": [
                "a",
                "b",
                "c",
                "d1",
                "O",
                "d2",
                "t"
            ],
            "dutyPattern": "operator",
            "itoName": "LI Chi-wai Joseph",
            "itoPostName": "ITO6",
            "lastMonthBalance": -0.42,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "a"
                    }
                ],
                "2": [
                    {
                        "shiftType": "O"
                    }
                ],
                "3": [
                    {
                        "shiftType": "O"
                    }
                ],
                "4": [
                    {
                        "shiftType": "c"
                    }
                ],
                "5": [
                    {
                        "shiftType": "c"
                    }
                ],
                "6": [
                    {
                        "shiftType": "O"
                    }
                ],
                "7": [
                    {
                        "shiftType": "a"
                    }
                ],
                "8": [
                    {
                        "shiftType": "a"
                    }
                ],
                "9": [
                    {
                        "shiftType": "a"
                    },
                    {
                        "shiftType": "t",
                        "claimType": "timeOff",
                        "description": "Seminar on Personal Data (Privacy) Ordinance and Personal Data Protection (GES/HK2)",
                        "duration": 2,
                        "endTime": "2024-09-09T04:00:00.000Z",
                        "shiftDetailId": "39dd78f14d",
                        "startTime": "2024-09-09T02:00:00.000Z",
                        "status": "approved"
                    }
                ],
                "10": [
                    {
                        "shiftType": "c"
                    }
                ],
                "11": [
                    {
                        "shiftType": "O"
                    }
                ],
                "12": [
                    {
                        "shiftType": "b"
                    }
                ],
                "13": [
                    {
                        "shiftType": "b"
                    }
                ],
                "14": [
                    {
                        "shiftType": "O"
                    }
                ],
                "15": [
                    {
                        "shiftType": "a"
                    }
                ],
                "16": [
                    {
                        "shiftType": "b"
                    }
                ],
                "17": [
                    {
                        "shiftType": "b"
                    }
                ],
                "18": [
                    {
                        "shiftType": "b"
                    }
                ],
                "19": [
                    {
                        "shiftType": "O"
                    }
                ],
                "20": [
                    {
                        "shiftType": "t",
                        "claimType": "training",
                        "description": "Seminar on Personal Data (Privacy) Ordinance and Personal Data Protection (GES/HK2)",
                        "duration": 1,
                        "endTime": "2024-09-20T06:00:00.000Z",
                        "shiftDetailId": "c66b13698f",
                        "startTime": "2024-09-20T05:00:00.000Z",
                        "status": "approved"
                    }
                ],
                "21": [
                    {
                        "shiftType": "c"
                    }
                ],
                "22": [
                    {
                        "shiftType": "O"
                    }
                ],
                "23": [
                    {
                        "shiftType": "d1"
                    }
                ],
                "24": [
                    {
                        "shiftType": "b"
                    }
                ],
                "25": [
                    {
                        "shiftType": "c"
                    }
                ],
                "26": [
                    {
                        "shiftType": "c"
                    }
                ],
                "27": [
                    {
                        "shiftType": "O"
                    }
                ],
                "28": [
                    {
                        "shiftType": "b"
                    }
                ],
                "29": [
                    {
                        "shiftType": "b"
                    }
                ],
                "30": [
                    {
                        "shiftType": "c"
                    }
                ]
            },
            "thisMonthBalance": 18.25,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 21,
            "actualWorkingHour": 174.25,
            "aShiftCount": 5,
            "bxShiftCount": 8,
            "cShiftCount": 7,
            "dxShiftCount": 1,
            "expectedWorkingHour": 156,
            "extraHour": -1,
            "totalBalance": 16.83
        },
        "ITO7_2024-04-12": {
            "availableShiftList": [
                "d1",
                "d2",
                "O",
                "a",
                "t"
            ],
            "dutyPattern": "day",
            "itoName": "CHIM Pui Wa Jeff",
            "itoPostName": "ITO7",
            "lastMonthBalance": 16.4,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "O"
                    }
                ],
                "2": [
                    {
                        "shiftType": "a"
                    }
                ],
                "3": [
                    {
                        "shiftType": "a"
                    }
                ],
                "4": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "5": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "6": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "7": [
                    {
                        "shiftType": "O"
                    }
                ],
                "8": [
                    {
                        "shiftType": "O"
                    }
                ],
                "9": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "10": [
                    {
                        "shiftType": "a"
                    }
                ],
                "11": [
                    {
                        "shiftType": "a"
                    }
                ],
                "12": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "13": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "14": [
                    {
                        "shiftType": "O"
                    }
                ],
                "15": [
                    {
                        "shiftType": "O"
                    }
                ],
                "16": [
                    {
                        "shiftType": "a"
                    }
                ],
                "17": [
                    {
                        "shiftType": "a"
                    }
                ],
                "18": [
                    {
                        "shiftType": "O"
                    }
                ],
                "19": [
                    {
                        "shiftType": "O"
                    }
                ],
                "20": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "21": [
                    {
                        "shiftType": "a"
                    }
                ],
                "22": [
                    {
                        "shiftType": "O"
                    }
                ],
                "23": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "24": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "25": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "26": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "27": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "28": [
                    {
                        "shiftType": "O"
                    }
                ],
                "29": [
                    {
                        "shiftType": "O"
                    }
                ],
                "30": [
                    {
                        "shiftType": "d2"
                    }
                ]
            },
            "thisMonthBalance": 11,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 20,
            "actualWorkingHour": 167,
            "aShiftCount": 7,
            "bxShiftCount": 0,
            "cShiftCount": 0,
            "dxShiftCount": 13,
            "expectedWorkingHour": 156,
            "extraHour": 0,
            "totalBalance": 27.4
        },
        "ITO8_1999-01-01": {
            "availableShiftList": [
                "a",
                "b",
                "c",
                "d1",
                "O",
                "d2",
                "t"
            ],
            "dutyPattern": "operator",
            "itoName": "CHAN Tai-hin Jimmy",
            "itoPostName": "ITO8",
            "lastMonthBalance": -0.29,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "O"
                    }
                ],
                "2": [
                    {
                        "shiftType": "b"
                    }
                ],
                "3": [
                    {
                        "shiftType": "b"
                    }
                ],
                "4": [
                    {
                        "shiftType": "O"
                    }
                ],
                "5": [
                    {
                        "shiftType": "O"
                    }
                ],
                "6": [
                    {
                        "shiftType": "b"
                    }
                ],
                "7": [
                    {
                        "shiftType": "b"
                    }
                ],
                "8": [
                    {
                        "shiftType": "c"
                    }
                ],
                "9": [
                    {
                        "shiftType": "c"
                    }
                ],
                "10": [
                    {
                        "shiftType": "O"
                    }
                ],
                "11": [
                    {
                        "shiftType": "O"
                    }
                ],
                "12": [
                    {
                        "shiftType": "O"
                    }
                ],
                "13": [
                    {
                        "shiftType": "c"
                    }
                ],
                "14": [
                    {
                        "shiftType": "c"
                    }
                ],
                "15": [
                    {
                        "shiftType": "O"
                    }
                ],
                "16": [
                    {
                        "shiftType": "c"
                    }
                ],
                "17": [
                    {
                        "shiftType": "O"
                    }
                ],
                "18": [
                    {
                        "shiftType": "a"
                    }
                ],
                "19": [
                    {
                        "shiftType": "O"
                    }
                ],
                "20": [
                    {
                        "shiftType": "b"
                    }
                ],
                "21": [
                    {
                        "shiftType": "b"
                    }
                ],
                "22": [
                    {
                        "shiftType": "c"
                    }
                ],
                "23": [
                    {
                        "shiftType": "c"
                    }
                ],
                "24": [
                    {
                        "shiftType": "O"
                    }
                ],
                "25": [
                    {
                        "shiftType": "b"
                    }
                ],
                "26": [
                    {
                        "shiftType": "O"
                    }
                ],
                "27": [
                    {
                        "shiftType": "d1"
                    }
                ],
                "28": [
                    {
                        "shiftType": "d1"
                    }
                ],
                "29": [
                    {
                        "shiftType": "d1"
                    }
                ],
                "30": [
                    {
                        "shiftType": "d1"
                    }
                ]
            },
            "thisMonthBalance": 0.5,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 19,
            "actualWorkingHour": 156.5,
            "aShiftCount": 1,
            "bxShiftCount": 7,
            "cShiftCount": 7,
            "dxShiftCount": 4,
            "expectedWorkingHour": 156,
            "extraHour": 0,
            "totalBalance": 0.21000000000000002
        },
        "ITO9_2024-02-19": {
            "availableShiftList": [
                "d1",
                "d2",
                "O",
                "a",
                "t"
            ],
            "dutyPattern": "day",
            "itoName": "Sze Wa Sang Leo",
            "itoPostName": "ITO9",
            "lastMonthBalance": 19.4,
            "shiftList": {
                "1": [
                    {
                        "shiftType": "O"
                    }
                ],
                "2": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "3": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "4": [
                    {
                        "shiftType": "a"
                    }
                ],
                "5": [
                    {
                        "shiftType": "a"
                    }
                ],
                "6": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "7": [
                    {
                        "shiftType": "O"
                    }
                ],
                "8": [
                    {
                        "shiftType": "O"
                    }
                ],
                "9": [
                    {
                        "shiftType": "a"
                    }
                ],
                "10": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "11": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "12": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "13": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "14": [
                    {
                        "shiftType": "O"
                    }
                ],
                "15": [
                    {
                        "shiftType": "O"
                    }
                ],
                "16": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "17": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "18": [
                    {
                        "shiftType": "O"
                    }
                ],
                "19": [
                    {
                        "shiftType": "a"
                    }
                ],
                "20": [
                    {
                        "shiftType": "a"
                    }
                ],
                "21": [
                    {
                        "shiftType": "O"
                    }
                ],
                "22": [
                    {
                        "shiftType": "O"
                    }
                ],
                "23": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "24": [
                    {
                        "shiftType": "a"
                    }
                ],
                "25": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "26": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "27": [
                    {
                        "shiftType": "d2"
                    }
                ],
                "28": [
                    {
                        "shiftType": "a"
                    }
                ],
                "29": [
                    {
                        "shiftType": "O"
                    }
                ],
                "30": [
                    {
                        "shiftType": "O"
                    }
                ]
            },
            "thisMonthBalance": 11,
            "workingHourPerDay": 7.8,
            "actualWorkingDayCount": 20,
            "actualWorkingHour": 167,
            "aShiftCount": 7,
            "bxShiftCount": 0,
            "cShiftCount": 0,
            "dxShiftCount": 13,
            "expectedWorkingHour": 156,
            "extraHour": 0,
            "totalBalance": 30.4
        }
    };
    let startDate = 1;
    let systemParam = {
        "maxConsecutiveWorkingDay": 6,
        "monthPickerMinDate": "2016-12-31T16:00:00.000Z",
        "noOfPrevDate": 2
    };
    //===================================================================================
    let autoPlanner = new AutoPlan(
        {
            endDate,
            essentialShift,            
            iterationCount,
            itoBlackListShiftPattern,
            itoIdList,
            preferredShiftList,
            previousMonthShiftList,
            roster,
            startDate,
            systemParam
        }
    )
    autoPlanner.doAutoPlan()

    return (<></>)
}