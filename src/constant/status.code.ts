const success_200 = {
  message: 'request has accepted properly.',
  statusCode: 200,
};

const teapot_418 = {
  teapot: 'use teabag instead of teapot : ',
  statusCode: 418,
};

function reject_with_msg(msg: string) {
  return {
    ...teapot_418,
    messaage: msg,
  };
}

export { success_200, reject_with_msg };
