<html>
  
  <head>

  </head>
  
  <body>
    <span>REQUEST</span>
    <p>
      <pre>IP: {{ print_r(request()->getClientIps()) }}</pre>
      <pre>HOST: {{ request()->getHttpHost() }}</pre>
      <pre>METHOD: {{ request()->getMethod() }}</pre>
      <pre>URI: {{ request()->getUri()}}</pre>
      <pre>PARAMS: {{ print_r(request()->all()) }}</pre>
    </p>

    <span>HEADERS</span>
    <p>
      <pre>{{request()->headers->__toString()}}</pre>
    </p>

    @if(auth()->user())
      <span>USER</span>
      <p>
        <pre>{{print_r(auth()->user()->toArray())}}</pre>
      </p>
    @endif

    <span>ERROR</span>
    <p>
      <pre>CODE: {{$e->getCode()}}</pre>
      <pre>MESSAGE: {{$e->getMessage()}}</pre>
      <pre>FILE: {{$e->getFile()}}</pre>
      <pre>LINE: {{$e->getLine()}}</pre>
      <pre>STACK TRACE: <br>{{$e->getTraceAsString()}}</pre>
    </p>

  </body>

</html>