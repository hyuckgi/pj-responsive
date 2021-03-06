import React from 'react';

const colors = [`254, 236, 218`, `177, 231, 213`, `166, 190, 249`, `242, 204, 191`, `255, 217, 136`, `177, 177, 177`, `75,192,192`];

const company = {
    'intro' : {
        'header' : {
            'title' : (<h2>9Spoons는 우리나라의 아름다운 상부상조 전통인 "열 개의 밥 숟가락이 모이면 한 그릇의 밥이 만들어 진다"는 十匙一飯(십시일반)에서 차용한 개념입니다.</h2>),
            'bgColor' : colors[0],
        },
        'body' : {
            'subTitle' : [(<p key="1">9Spoons는 "이미 9개의 숟가락은 모여있으니, 회원 한 사람만 도와주면 한 그릇이 완성된다는 의미"입니다.</p>)],
            'text' : [(<p key="2">9Spoons는 기부 환경에서 두 가지의 문제점을 해소하기 위해서 탄생되었습니다. 따라서 9spoons의 핵심 가치는 두 가지입니다.</p>)],
            'contents' : [
                (<p key="1">첫 번째는, 기부금이 필요한 어려운 이웃에게 <span>직접기부</span>를 통해서 모금된 기부금 100%를 투명하게 전달하는 시스템을 구현합니다.</p>),
                (<p key="2">두 번째는, 기부를 하고 싶어도 주머니 사정이 빠듯한 보통 사람들의 따뜻한 마음을 지닌 회원이 기업의 광고를 시청해주는 행동으로 <span>시간기부</span>를 통해 어려운 이웃에게 도움을 주는 방식으로 기부 환경을 새롭게 조성하고자 합니다.</p>)
            ]
        }
    },

    'spirit' : {
        'header' : {
            'title' : (<h2>9Spoons는 회원이 자신의 자투리 시간을 기부해서, 자신이 생활하는 지역 공동체의 어려운 이웃에게 삶의 희망과 용기를 줄 수 있는 기부플랫폼 입니다.</h2>),
            'bgColor' : colors[1],
        },
        'body' : {
            'subTitle' : [(<p key="1">9Spoons는 나의 작은 시간 기부가, 함께 사는 세상을 좀 더 밝고 희망이 있는 세상을 만들 수 있다는 확신을 가지고, 우리 모두다 함께 “사람이 우선인 세상”을 만드는데 온 마음을 합쳐 노력할 수 있기를 소망합니다.</p>)],
            'contents' : [
                (<p key="1">9Spoons는 회원이 시간 기부를 한 만큼 기부금이 적립되어, 회원의 이름으로 기부가 되는 시스템입니다. 누군가를 돕는다는 것은 자신이 행복해지는 첫 번째 덕목입니다. 사회의 구성원으로서 어려운 이웃을 돕고 있다는 사실은 자부심과 자신감을 가질 수 있을 것 입니다. 더불어 자신이 행복해집니다.</p>),
                (<p key="2">9Spoons 회원은 정직, 성실, 책임, 투명, 사랑, 신뢰 등의 마인드를 지니고, 자신이 속해있는 공동체를 “살 맛 나는 세상”으로 만들기 위해 살아가는 사람들 입니다.</p>),

            ]
        }
    },

    'integrity' : {
        'header' : {
            'title' : (<h2>9Spoons는 가짜 스토리 방지 시스템으로 어려운 이웃이 거주하는 지역(관심지역) 회원의 일정 수 이상의 추천 또는 전체 회원의 일정 수 이상의 추천이 있을 경우에만 기부금 모금이 시작되는 시스템 입니다.</h2>),
            'bgColor' : colors[2],
        },
        'body' : {
            'subTitle' : [
                (<p key="1">9Spoons는 또 기부금 모금이 시작되어 기부금이 적립되고 있거나 모금이 완료되었어도 기부금 지급 전인 상황일지라도 가짜 스토리 등의 신고가 들어오면 모금이 즉시 중단되고, 사실관계 확인 후 모금이 재개되거나 영원히 중단되는 시스템 입니다. 따라서 가짜 스토리를 작성한 회원은 즉시 퇴출되고, 허위 신고를 한 회원도 삼진아웃 제도로 퇴출되는 <span>[클린 시스템]</span> 입니다. </p>)
            ],
            'contents' : [
                (<p key="1">9Spoons는 스폰서 회원의 기부금을 어려운 이웃에게 단돈 1원도 사용하지 않고 100% 전달합니다. 스폰서 회원의 기부금은 에스크로 통장에 보관하고, 적립이 완성되는 시점에 수혜자를 대면하여 확인하고 계좌에 이체하는 방식으로 진행됩니다. </p>),
                (<p key="2">9Spoons는 매 분기별로 분기가 지나면, 2주 이내에 분기별 <span>[기부 현황 보고서]</span> 를 공개합니다.</p>),
                (<p key="3">9Spoons는 매일매일 회원의 기부 내역을 통계하여 반영하고, 연 1회 Donation Award를 개최하여 스폰서 회원의 기부를 칭찬하고 회원의 기부를 독려하여 따뜻한 세상을 구현하는데 일조하고자 합니다.</p>),
                (<p key="4">9Spoons는 일정 금액 이상의 시간기부를 하신 회원에게 명예와 자부심을 느낄 수 있는 작은 선물을 전달하여, 기부를 일상 생활 속에 자리잡게 만들어 내고자 합니다.  </p>),

            ]
        }
    },

    'charity' : {
        'header' : {
            'title' : (<h2>9Spoons는 어려운 이웃의 스토리가 1회 SNS로 공유될 때마다 100원을 추가로 기부합니다.</h2>),
            'bgColor' : colors[4],
        },
        'body' : {
            'contents' : [
                (<p key="1">9Spoons는 우리가 함께 사는 사회를 “살 맛나는 세상”으로 만들기 위해 작은 밀알이 되고자 노력하겠습니다.</p>),
                (<p key="2">9Spoons는 계속해서 “살 맛나는 세상”을 위해 9Spoons가 할 수 있는 일을 찾아서 최대한 노력할 것을 다짐합니다.</p>),
            ]
        }
    }
}

export {
    company,
    colors
}
