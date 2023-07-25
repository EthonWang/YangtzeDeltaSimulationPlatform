package yangtzedeltasimulatorbackend.enums;


/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
public enum ResultEnum {
    SUCCESS(0, "Success"),
    NO_OBJECT(-1, "No object"),
    ERROR(-2,"Error"),
    UNAUTHORIZED(-3,"Unauthorized");


    private int code;

    private String msg;

    ResultEnum(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
