let grade = "小4";
let saku = "作";
let official_support_server = "https://discord.gg/arW5kCW2P8";
let view_data = false;
let server_view_data = true;

export function getgrade() {
  if (view_data == true) {
    return grade;
  } else {
    return "";
  }
}

export function getsaku() {
  if (view_data == true) {
    return saku;
  } else {
    return "";
  }
}

export function getsupport() {
  if (server_view_data == true) {
    return official_support_server;
  } else {
    return "未作成";
  }
}
