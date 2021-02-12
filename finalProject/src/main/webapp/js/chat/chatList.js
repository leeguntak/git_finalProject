//채팅 리스트 불러오기
$.ajax({
	type: 'post',
	url: '/market/chat/getChatList',
	dataType: 'json',
	success:function(data){
		$.each(data.chatList, function(index, items){
			$('<button/>', { //1단계
				class: 'chatRoomBox',
				id: items.chat_seq
			
			}).append($('<div/>', { //2단계 --- profile
				class: 'chatRoom_profile'
					
				}).append($('<img/>', { //3단계
					id: 'other_store_img',
					src: '/market/storage/'+items.other_store_img,
				})

			)).append($('<div/>', { //2단계 --- content
				class: 'chatRoom_content'
					
				}).append($('<span/>', { //3단계
					id: 'other_store_nickname',
					text: items.other_store_nickname
						
				})).append($('<span/>', { //3단계
					id: 'chat_logtime',
					text: items.chat_logtime
						
				})).append($('<span/>', { //3단계
					id: 'last_message',
					text: items.last_message
				})
				
			)).append($('<div/>', { //2단계 --- btns
				class: 'chatRoom_btns'
					
				}).append($('<button/>', { //3단계
					id: 'chatComplainBtn',
					text: '신고'
						
				})).append($('<button/>', { //3단계
					id: 'chatDeleteBtn',
					text: '나가기'
				})
				
			)).appendTo($('.chatRoomWrap'));
			
			//변수 설정
			if($('.chatRoomWrap').find('input').length == 0) { //중복 설정 방지
				$('.chatRoomWrap').append($('<input/>', {
					type: 'hidden',
					id: 'hiddenVal',
					name: 'other_store_nickname',
					value: items.other_store_nickname
				}))
			}

			//채팅방 연결(post방식으로 팝업창)
			$('#'+items.chat_seq).click(function() {
				$('#hiddenVal').val(items.other_store_nickname); //선택한 방번호의 닉네임 변수값으로 설정
				
				window.open('', 'chatRoom', 'width=370 height=670');
				$('#chatList').submit();
			});
			
		});//each
    },
	error: function(error) {
		alert('error : ', error)
	}
});


// resizable=no





	