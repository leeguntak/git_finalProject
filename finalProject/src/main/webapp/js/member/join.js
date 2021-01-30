let name_rule=/^[가-힣]+$/;
let id_rule=/^[0-9a-z]{4,20}$/;
let pwd_rule=/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[.!@#$%^&+=]).*$/; 
let email_rule=/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
let phone_rule=/^\d{3}-\d{3,4}-\d{4}$/;



//회원가입 입력
$('#joinBtn').click(function(){
	$('#nameDiv').empty();
	$('#idDiv').empty();
	$('#pwdDiv').empty();
	$('#repwdDiv').empty();
	$('#emailDiv').empty();
	$('#emailNumDiv').empty();
	$('#telDiv').empty();
	$('#postcodeDiv').empty();
	$('#addDiv').empty();
	
//	if($('#name').val()=='')
//		$('#nameDiv').text('이름를 입력하세요');
//	else if($('#id').val()=='')
//		$('#idDiv').text('아이디를 입력하세요');
//	else if($('#pwd').val()=='')
//		$('#pwdDiv').text('비밀번호를 입력하세요');
//	else if($('#repwd').val()=='')
//		$('#repwdDiv').text('비밀번호를 확인하세요');
//	else if($('#email1').val()==''||$('#email2').val()=='')
//		$('#emailDiv').text('이메일을 입력하세요');
//	else if($('#emailNum).val()=='')
//		$('#emailNumDiv').text('');
//	else if($('#tel2').val()==''|| $('#tel3').val()=='')
//		$('#telDiv').text('전화번호를 입력하세요');
//	else if($('#postcode').val()=='')
//		$('#postcodeDiv').text('우편번호를 검색하여 입력하세요');
//	else if($('#add1').val()==''||$('#add2').val()=='')
//		$('#addDiv').text('주소를 입력하세요');
//	else if($('.check1').prop('checked') ==false||$('.check2').prop('checked') ==false||$('.check3').prop('checked')==false){
//		$('#checkboxDiv').text('필수동의사항에 체크하세요');
//	}
//	else{
		$('#email').val($('#email1').val() + '@' + $('#email2').val()); 
		$('#tel').val($('#tel1').val() + '-' + $('#tel2').val() + '-' +$('#tel3').val()); 
		$('form[name=joinForm]').submit();
//	}
});

//1. 이름 형식 검사
$('#name').focusout(function(){
	if(!name_rule.test($('#name').val())){
		$('#nameDiv').text('이름은 한글만 입력 가능합니다');
	}
});

//2. 아이디 형식검사 + 중복확인 (ajax) -> 데이터 베이스 작업
$('#id').focusout(function(){
//	아이디 형식 검사
	if(!id_rule.test($('#id').val()))
		$('#idDiv').text('아이디는 영문 소문자 + 숫자 조합 4-20글자로 작성하세요');
//	이메일 중복검사
	else{
		$.ajax({
			type: 'post',
			url: '/market/member/checkId',
			data: 'id='+$('#id').val(),
			dataType : 'text',
			success: function(result){
				if(result == "exist"){ //사용불가
					$('#idDiv').text('이미 사용 중인 아이디입니다.');
				}else if(result =='non_exist'){//사용가능
					$('#hiddenId').val($('#id').val()); 
					$('#idDiv').text('사용 가능한 아이디입니다').css('color', 'blue');
				}
			}
		});
	}
});


//4. 비밀번호 형식 검사
$('#pwd').focusout(function(){
	if(!pwd_rule.test($('#pwd').val())) //8-15글자. 특문+영문+숫자 조합
		$('#pwdDiv').text('올바르지 않은 비밀번호 형식입니다.');
});

//5. 비밀번호 불일치
$('#repwd').focusout(function(){
	if($('#repwd').val() != $('#pwd').val())
		$('#repwdDiv').text('비밀번호가 일치하지 않습니다');
});

//6. 이메일 형식 검사
$('#email1').focusout(function(){
	if(!($('#email1').val()==''||$('#email2').val()=='')){
		let emailForm = $("#email1").val()+"@"+$("#email2").val();
		if(!email_rule.test(emailForm)){
			$('#emailDiv').text("이메일을 형식에 맞게 입력해주세요.");
		}
	}
});
$('#email2').focusout(function(){
	if(!($('#email1').val()==''||$('#email2').val()=='')){
		let emailForm = $("#email1").val()+"@"+$("#email2").val();
		if(!email_rule.test(emailForm)){
			$('#emailDiv').text("이메일을 형식에 맞게 입력해주세요.");
		}
	}
});
//이메일 인증번호 버튼 클릭(인증번호 발송)
$('#certifyEmailBtn').click(function(){
	$('#email').val($('#email1').val() + '@' + $('#email2').val()); 
	$.ajax({
		type: 'post',
		url: '/market/member/sendMail',
		data: 'mem_email='+$('#email').val(),
		dataType : 'json',
		success: function(result){
			$('#randomNum').val(result.randomNum); 
			$('#emailNumDiv').text('작성하신 이메일로 인증번호를 발송했습니다');
		},error: function(err){
			console.log(err);
		}
	});
});

//이메일 인증 확인
$("#emailNum").on("keyup",function(){
	let emailNum = $(this).val();
	$.ajax({
		type: 'post',
		url: '/market/member/confirmMail',
		data: 'emailNum='+emailNum+"&randomNum="+$('#randomNum').val(),
		dataType: 'json',
		success: function(result){
			if(result.emailNum == result.randomNum){
				$('#emailNumDiv').text('인증 완료되었습니다.').css('color','blue');
				 $("#tel1").focus();
			}else{
				$('#emailNumDiv').text('인증번호가 일치하지 않습니다!');
			}
		}
	});
});


//7. 전화번호 4자리 숫자 다 쓰면 다음 칸으로 자동 포커스 넘어가기
$("#tel2").on("keyup",function(){
    var mch = $(this).val().match(/[0-9]/g);
    if( mch != null && mch.length == 4 )
       $("#tel3").focus();
});	

// 휴대폰 번호 형식 검사
$('#tel2').focusout(function(){
	if(!($('#tel2').val()=='')||($('#tel3').val()=='')){
		let phoneForm = $('#tel1').val() +"-"+ $('#tel2').val() + "-" + $('#tel3').val();
		
		if (!phone_rule.test(phoneForm))
			$('#telDiv').text('올바르지 않은 전화번호 형식입니다.');
			
	}
});
$('#tel3').focusout(function(){
	if(!($('#tel2').val()=='')||($('#tel3').val()=='')){
		let phoneForm = $('#tel1').val() +"-"+ $('#tel2').val() + "-" + $('#tel3').val();
		
		if (!phone_rule.test(phoneForm))
			$('#telDiv').text('올바르지 않은 전화번호 형식입니다.');
	}
});


//우편 번호
$('#checkPostBtn').click(function(){
	window.open("/market/member/postForm.jsp", "postForm", "width=700 height= 500 scrollbars=yes");
});

//우편 번호 창 검색
$('#searchPostBtn').click(function(){
	$.ajax({
		type:'post',
		url:'/market/member/searchPost',
		data:$('#postForm').serialize(),
		dataType:'json',
		success:function(result){
			$('#postTable tr:gt(2)').remove(); 
			
//			▶ 검색결과 출력
			$.each(result.list, function(index, items){ 
				let address = items.sido+' '
							+ items.sigungu+' '
							+ items.yubmyundong+' '
							+ items.ri +' '
							+ items.roadname +' '
							+ items.buildingname;
				address = address.replace(/null/g, '');
				
				$('<tr/>').append($('<td/>',{ 
					align: 'center',
					text: items.zipcode
					})).append($('<td/>',{
						colspan:'3',
						}).append($('<a/>',{ 
							href:'#',
							id:'addressA',
							text: address
							}))
				).appendTo($('#postTable'));
			});//each
			
//			 ▶ 선택한 주소의 값을 회원가입 창에 전달하기
			$('a').click(function(){//클릭한 a태그
				$('#postcode', opener.document).val($(this).parent().prev().text());
				$('#add1', opener.document).val($(this).text());
				$('#add2', opener.document).focus();
				window.close();
			});
		},error: function(err){
			console.log(request.status + "\n message : " +request.responseText +"\n err:");
			alert(err);
		}
	});
});

//약관동의--------------------------------------------------------------

$('#personalData').click(function(){
	window.open("/market/member/a_personalData.jsp", "personalData", "width=700 height= 500 scrollbars=yes");
});
$('#serviceTerm').click(function(){
	window.open("/market/member/a_serviceTerm.jsp", "serviceTerm", "width=700 height= 500 scrollbars=yes");
});

//▶ 체크박스 전체 선택 & 전체 해제
$('#all').click(function(){
 	if($('#all').prop('checked'))
 		$('input[name=check]').prop('checked', true);
 	else
 		$('input[name=check]').prop('checked', false);
 	if($('input[name=check]').prop('checked'))
 			$('#all').prop('checked', true);
});
$(".check").click(function(){
	if($("input[name='check']:checked").length==4){
		$('#all').prop('checked', true);
	}else{
		$('#all').prop('checked', false);
	}
});


