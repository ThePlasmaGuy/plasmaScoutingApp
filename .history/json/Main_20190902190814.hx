class Main {
    public static function main() {
        var a = sys.io.File.getContent("inputs.json");
        var b = haxe.format.JsonPrinter.print(a);
        trace(b);
    }
}