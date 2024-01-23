/* 지도 섹션 시작 */

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(33.4423379727783, 126.571449734542), // 지도의 중심좌표

        level: 4 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

function setMapType(maptype) {
    var roadmapControl = document.getElementById('btnRoadmap');
    var skyviewControl = document.getElementById('btnSkyview');
    if (maptype === 'roadmap') {
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
        roadmapControl.className = 'selected_btn';
        skyviewControl.className = 'btn';
    } else {
        map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
        skyviewControl.className = 'selected_btn';
        roadmapControl.className = 'btn';
    }
}

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

// 마커가 표시될 위치입니다
var markerPosition = new kakao.maps.LatLng(33.4423379727783, 126.571449734542);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
    position: markerPosition
});
map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true);
// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

/* 지도 섹션 끝 */

/* 모달 섹션 시작 */
const modal = document.querySelector('.cat-modal');
const modalOverlay = document.querySelector('.modal-overlay');

function hideModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function showModal() {
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
}

document.querySelector('.subscribe-form').addEventListener('submit', function (e) {
    e.preventDefault(); //

    // 더미 응답을 위한 Promise 생성
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({message: "Subscription successful!"});
        }, 500);
    })
        .then(data => {
            console.log(data.message);
            showModal();
        })
        .catch(error => {
            // 오류 처리.
            console.error('Error:', error);
        });
});


document.getElementById(`close-modal`).addEventListener('click',  hideModal);

/* 모달 섹션 끝 */

/* 무한 스크롤링 섹션 시작 */

const showMoreBtn = document.querySelector('.gallery-show-more .btn-layout');
const imageList = document.querySelector('.show-more-ground article');
const progressBar = document.querySelector('.progress-bar');
const progressBarFill = document.querySelector('.progress-bar-fill');
let pageToFetch = 1;
let loadCount = 0;

// 이미지를 가져와서 화면에 표시하는 함수
async function fetchImages(pageNum) {
    if (loadCount >= 100) {
        progressBar.classList.add('hidden');
        return;
    }
    for (let i = 0; i < 3; i++) {
        try {
            const imageUrl = `https://loremflickr.com/378/378/cat?random=${pageNum}-${i}`;
            addImagesToPage(imageUrl);
        } catch (error) {
            console.error('Failed to fetch images:', error);
        }
    }
    loadCount++;
    updateProgressBar();
}

// 받아온 이미지를 페이지에 추가하는 함수
function addImagesToPage(imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'catImg';
    imageList.appendChild(img);
}

// 프로그레스바 업데이트 함수
document.addEventListener('DOMContentLoaded', () => {
    if (loadCount === 0) {
        progressBar.classList.add('hidden');
    }
});

function updateProgressBar() {
    const progress = (loadCount / 100) * 100;
    progressBarFill.style.width = `${progress}%`;
    progressBarFill.style.backgroundPosition = `${progress}% 0`;
}

// 스크롤 이벤트를 처리하는 함수
function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2500) {
        fetchImages(pageToFetch++);
    }
}

// Throttling 함수 정의
const throttling = (callback, delay) => {
    let timer = null;
    return () => {
        if (timer === null) {
            timer = setTimeout(() => {
                callback();
                timer = null;
            }, delay);
        }
    };
};


const throttledHandleScroll = throttling(handleScroll, 300);

showMoreBtn.addEventListener('click', () => {
    progressBar.classList.remove('hidden');
    loadCount = 0; // 로드 횟수 리셋

    // 이전 스크롤 이벤트 리스너 제거 후 새로 추가. n+1현상
    window.removeEventListener('scroll', throttledHandleScroll);
    window.addEventListener('scroll', throttledHandleScroll);

    fetchImages(pageToFetch++);

});
/* 무한 스크롤링 섹션 끝 */